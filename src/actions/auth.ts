"use server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/config/db";
import { createSession } from "@/lib/session";
import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  updateUserSchema,
} from "@/lib/validation/auth";
import { hashPassword, verifyPassword } from "@/util/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteImage, uploadImage } from "@/util/upload";

export async function register(_: unknown, formData: FormData) {
  const inputs = {
    fullname: formData.get("fullname") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    position: formData.get("position") as string,
  };

  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاها را برطرف کنید",
      inputs,
    };
  }

  const { password, username, fullname, image, position } = result.data;

  try {
    await connectDB();
    const user = await User.findOne({ username });

    if (user) {
      return {
        success: false,
        message: "کارمندی با این نام کاربری وجود دارد",
        inputs,
      };
    }

    const userProfile = await uploadImage(image, "avatar");

    if (userProfile.message) {
      return {
        message: userProfile.message,
        success: false,
        inputs,
      };
    }

    const hashedPassword = hashPassword(password);
    const users = await User.find({});

    await User.create({
      fullname,
      username,
      position,
      image: userProfile,
      password: hashedPassword,
      role: users.length > 0 ? "EMPLOYEE" : "HR",
    });

    return { message: "کارمند با موفقیت ایجاد شد", success: true };
  } catch (e) {
    console.log(e);
    return { message: "خطای سمت سرور", success: false, inputs };
  }
}

export async function login(_: unknown, formData: FormData) {
  const inputs = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاها را برطرف کنید",
      inputs,
    };
  }

  const { password, username } = result.data;

  try {
    await connectDB();
    const user = await User.findOne({ username });

    if (!user) {
      return {
        message: "کاربر با این نام کاربری یافت نشد",
        success: false,
        inputs,
      };
    }

    const isCorrectPassword = verifyPassword(password, user.password);

    if (!isCorrectPassword) {
      return {
        success: false,
        message: "نام کاربری یا رمز عبور درست نیست",
        inputs,
      };
    }

    await createSession({ userId: user._id.toString(), role: user.role });

    return {
      success: true,
      message: "شما با موفقیت وارد شدین",
    };
  } catch (e) {
    console.log(e);
    return { message: "خطای سمت سرور", success: false, inputs };
  }
}

export async function updateUser(
  _: unknown,
  formData: FormData,
  userId: string
) {
  const inputs = {
    username: formData.get("username") as string,
  };

  const result = updateUserSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاها را برطرف کنید",
      inputs,
    };
  }

  const { image, username } = result.data;

  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return {
        message: "کاربر یافت نشد",
        success: false,
        inputs,
      };
    }

    let profile;
    if (image) {
      const { success } = await deleteImage(user.image.path);

      if (!success) {
        return {
          message: "مشکلی در حدف عکس",
          success: false,
        };
      }

      profile = await uploadImage(image, "avatar");

      if (profile.message) {
        return {
          message: profile.message,
          success: false,
        };
      }
    }

    await User.findOneAndUpdate({ _id: userId }, { image: profile, username });
    return { message: "اطلاعات باموفقیت ویرایش شد", success: true };
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }
}

export async function updatePassword(
  _: unknown,
  formData: FormData,
  userId: string
) {
  const inputs = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
  };

  const result = newPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاها را برطرف کنید",
      inputs,
    };
  }

  const { currentPassword, newPassword } = result.data;

  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return {
        message: "کاربر یافت نشد",
        success: false,
        inputs,
      };
    }

    const isCorrectPassword = verifyPassword(currentPassword, user.password);

    if (!isCorrectPassword) {
      return {
        message: "رمز عبور فعلی شما اشتباه است",
        success: false,
        inputs,
      };
    }

    const newHashedPassword = hashPassword(newPassword);

    await User.findByIdAndUpdate(
      { _id: userId },
      { password: newHashedPassword }
    );

    return { message: "پسورد شما با موفقیت تغییر کرد", success: true };
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
