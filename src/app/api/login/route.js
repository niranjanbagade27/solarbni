import dbConnect from "@/lib/mongodb";
dbConnect();
import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return NextResponse.json(
        {
          message: "User email or password is incorrect",
        },
        {
          status: 404,
        }
      );
    }
    const comparePassword = await bcrypt.compare(password, getUser.password);
    if (!comparePassword) {
      return NextResponse.json(
        {
          message: "User email or password is incorrect",
        },
        {
          status: 400,
        }
      );
    }
    const {
      _doc: { _id, password: getUserPassword, ...user },
    } = getUser;
    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while logging user",
      },
      {
        status: 500,
      }
    );
  }
}
