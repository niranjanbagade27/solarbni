import dbConnect from "@/lib/mongodb";
dbConnect();
import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;
    const getUser = await User.findOne({ email });
    if (getUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const localRole = role
    const user = new User({ email, password: hashedPassword, role: localRole});
    console.log(user);
    await user.save();
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while creating user",
      },
      {
        status: 500,
      }
    );
  }
}
