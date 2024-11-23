import { NextResponse } from "next/server";
import User from "@/Models/user";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    const getUser = await User.findOne({
      email: sanitizeHtml(email),
      role: userRoles.OEM,
    }).select("-password");
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
    await User.findOneAndDelete({
      email: sanitizeHtml(email),
      role: userRoles.OEM,
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while deleting oem",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect()