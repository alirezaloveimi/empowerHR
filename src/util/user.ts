import "server-only";
import User from "@/lib/models/User";
import "@/lib/models/Position";

import { cookies } from "next/headers";
import { connectDB } from "@/lib/config/db";
import { decrypt } from "@/lib/session";

export async function getUser(): Promise<User | undefined> {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session || !session.userId) return undefined;

    await connectDB();

    const user = await User.findOne(
      { _id: session.userId },
      "-createdAt -updatedAt -__v -password"
    ).populate("position", "title");

    return user;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
