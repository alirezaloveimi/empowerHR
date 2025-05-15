import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { registerSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/util/password";
import { uploadImage } from "@/util/upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { password, username, fullname, image, position } = result.data;

  try {
    await connectDB();
    const user = await User.findOne({ username });

    if (user) {
      return NextResponse.json(
        { message: "User Exist Alredy" },
        { status: 400 }
      );
    }

    const userProfile = await uploadImage(image, "avatar");

    if (userProfile.message) {
      return NextResponse.json(
        { message: userProfile.message },
        { status: 400 }
      );
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

    return NextResponse.json({ message: "کاربر با موفقیت ایجاد شد" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "Hello World" });
}
