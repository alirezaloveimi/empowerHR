"use server";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/config/db";
import { Types } from "mongoose";

import Imprest from "@/lib/models/Imprest";
import User from "@/lib/models/User";
import Vacation from "@/lib/models/Vacation";

import {
  addImprestSchema,
  addPositionSchema,
  addVacationSchema,
  updateImprestSchema,
  updateVacationSchema,
} from "@/lib/validation/employee";
import { getChangedFields } from "@/util/form";
import { priceWithDots } from "@/util/price";
import Position from "@/lib/models/Position";

const limitMonthRequest = 2;

export async function addImprest(
  _: unknown,
  formData: FormData,
  userId: string
) {
  const inputs = { amount: formData.get("amount") as string };
  const result = addImprestSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاها را برطرف کنید",
      success: false,
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const { amount } = result.data;

  try {
    await connectDB();
    const employee = await User.findOne({ _id: userId });

    if (!employee) {
      return { message: "کارمندی یافت نشد", success: false, inputs };
    }

    const monthlyLimit = employee.monthlyLimit || 5_000_000;

    if (amount > monthlyLimit) {
      return {
        message: "مبلغ مساعده شما بیش از حد مجاز میباشد",
        success: false,
        inputs,
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const pendingImprestCount = await Imprest.countDocuments({
      employee: userId,
      status: "PENDING",
      requestedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (pendingImprestCount >= limitMonthRequest) {
      return {
        message: "تعداد درخواست‌های برسی نشده این ماه شما پر شده است",
        success: false,
        inputs,
      };
    }

    const monthlyTotal = await Imprest.aggregate([
      {
        $match: {
          employee: new Types.ObjectId(userId),
          status: { $in: ["ACCEPT", "PENDING"] },
          requestedAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const requestedAmount = monthlyTotal[0]?.totalAmount || 0;

    if (requestedAmount + amount > monthlyLimit) {
      return {
        message: `جمع مساعده (درانتظار,تاییدشده) درخواستی شما بیش از حد مجاز میباشد : ${priceWithDots(
          requestedAmount
        )} تومان`,
        success: false,
        inputs,
      };
    }

    await Imprest.create({
      amount,
      employee: userId,
    });
  } catch (e) {
    console.log(e);
    return { message: "مشکل سمت سرور", success: false, inputs };
  }

  revalidatePath("/p-employee/imprests");
  return { success: true, message: "مساعده با موفقیت ارسال شد" };
}

export async function updateImprest(
  _: unknown,
  formData: FormData,
  imprestId: string
) {
  const inputs = {
    message: formData.get("message") as string,
    status: formData.get("status") as string,
  };
  const result = updateImprestSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاها را برطرف کنید",
      success: false,
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  try {
    await connectDB();
    const imprest = await Imprest.findById(imprestId);

    if (!imprest) {
      return { message: "مساعده یافت نشد", success: false, inputs };
    }

    const { changed, isChanged } = getChangedFields(imprest, result.data);

    if (!isChanged) {
      return { message: "تغییری ایجاد نشده", success: false, inputs };
    }

    await Imprest.findByIdAndUpdate(imprestId, { ...changed });
  } catch (e) {
    console.log(e);
    return { message: "مشکل سمت سرور", success: false, inputs };
  }

  revalidatePath("/p-hr/imprests");
  return { message: "مساعده با موفقیت بروزرسانی شد", success: true };
}

export async function addVacation(
  _: unknown,
  formData: FormData,
  userId: string
) {
  const inputs = {
    reason: formData.get("reason") as string,
  };

  const result = addVacationSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاها را برطرف کنید",
      success: false,
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const { reason, requestDate } = result.data;
  const dateObj = new Date(Number(requestDate));

  try {
    await connectDB();
    const employee = await User.findOne({ _id: userId });

    if (!employee) {
      return { message: "کارمندی یافت نشد", success: false, inputs };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const thisMonthVacations = await Vacation.find({
      employee: userId,
      requestDate: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $in: ["PENDING", "ACCEPT"] },
    });

    if (thisMonthVacations.length >= limitMonthRequest) {
      return {
        success: false,
        message: "سقف مرخصی این ماه شما پر شده است (۲ روز)",
        inputs,
      };
    }

    const alreadyTaken = thisMonthVacations.some(
      (v) => v.requestDate.toDateString() === dateObj.toDateString()
    );

    if (alreadyTaken) {
      return {
        success: false,
        message: "شما قبلاً برای این روز مرخصی گرفته‌اید",
        inputs,
      };
    }

    await Vacation.create({
      employee: userId,
      requestDate,
      reason,
    });
  } catch (e) {
    console.log(e);
    return { message: "مشکل سمت سرور", success: false, inputs };
  }

  revalidatePath("/p-employee/vacations");
  return { message: "مرخصی شما ثبت شد", success: true };
}

export async function updateVacation(
  _: unknown,
  formData: FormData,
  vacationId: string
) {
  const inputs = {
    message: formData.get("message") as string,
    status: formData.get("status") as string,
  };
  const result = updateVacationSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاها را برطرف کنید",
      success: false,
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  try {
    await connectDB();
    const vacation = await Vacation.findById(vacationId);

    if (!vacation) {
      return { message: "مساعده یافت نشد", success: false, inputs };
    }

    const { changed, isChanged } = getChangedFields(vacation, result.data);

    if (!isChanged) {
      return { message: "تغییری ایجاد نشده", success: false, inputs };
    }

    await Vacation.findByIdAndUpdate(vacationId, { ...changed });
  } catch (e) {
    console.log(e);
    return { message: "مشکل سمت سرور", success: false, inputs };
  }

  revalidatePath("/p-hr/vacations");
  return { message: "مرخصی با موفقیت بروزرسانی شد", success: true };
}

export async function addPosition(_: unknown, formData: FormData) {
  const inputs = { title: formData.get("title") as string };
  const result = addPositionSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاها رو برطرف کنید",
      errros: result.error.flatten().fieldErrors,
      success: false,
      inputs,
    };
  }

  const { title } = result.data;

  try {
    await connectDB();
    const position = await Position.findOne({ title });

    if (position) {
      return {
        message: "شغل با این عنوان موجود میباشد",
        success: false,
        inputs,
      };
    }

    await Position.create({ title });
  } catch (e) {
    console.log(e);
    return { message: "مشکلی سمت سرور", success: false };
  }

  revalidatePath("/p-hr/positions");
  return { message: "شغل جدید با موفقیت ایجاد شد", success: true };
}
