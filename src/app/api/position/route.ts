import { NextResponse, NextRequest } from "next/server";

import { connectDB } from "@/lib/config/db";
import Position from "@/lib/models/Position";

import { getUser } from "@/util/user";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;

    await connectDB();
    await Position.create({ title });
    return NextResponse.json({ message: "Position Created" }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export const GET = async () => {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (user.role !== "HR") {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const positions = await Position.find({});
    return NextResponse.json(positions, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unknown Server Error" },
      { status: 500 }
    );
  }
};
