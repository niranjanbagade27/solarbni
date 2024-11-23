import { NextResponse } from "next/server";
import User from "@/Models/user";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    const sanitizedEmail = sanitizeHtml(email);
    const getUser = await User.findOne({ email: sanitizedEmail, role: userRoles.OEM }).select(
      "-password"
    );
    if (!getUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        user: getUser,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while searching oem",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect();
