import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);
    const getUser = await User.findOne({ email: sanitizedEmail });
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
    const comparePassword = await bcrypt.compare(
      sanitizedPassword,
      getUser.password
    );
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
      _doc: { password: getUserPassword, ...user },
    } = getUser;
    if (user.role === userRoles.CONTRACTOR && !user.verified) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      const token = jwt.sign({ user }, `${process.env.JWT_SECRET}`, {
        expiresIn: "5h",
      });
      const response = NextResponse.json({ token, user }, { status: 200 });
      response.headers.set(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
      );
      return response;
    }
  } catch (e) {
    console.log("inside catch block", e);
    return NextResponse.json(
      {
        message: "Error while logging in",
      },
      {
        status: 500,
      }
    );
  }
}
