import { NextResponse } from "next/server";
import User from "@/Models/user";
import jsonwebtoken from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";

export async function GET(request) {
  try {
    const token = request.cookies.get("token").value;
    if (!token) {
      return NextResponse.json(
        {
          message: "User is not logged in",
        },
        {
          status: 401,
        }
      );
    }
    const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const getUser = await User.findOne({ _id: decoded.user._id });
    if (!getUser) {
      return NextResponse.json(
        {
          message: "User is not logged in",
        },
        {
          status: 401,
        }
      );
    }
    const { password, ...user } = getUser._doc;
    return NextResponse.json(
      {
        user,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while verifying user",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect();
