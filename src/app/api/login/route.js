import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
export async function POST(request) {
  try {
    console.log("inside login route");
    const body = await request.json();
    const { email, password } = body;
    console.log("got email and password", email, password);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);
    console.log(
      "sanitized email and password",
      sanitizedEmail,
      sanitizedPassword
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    const getUser = await User.findOne({ email: sanitizedEmail });
    console.log("got user", getUser);
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
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({ token, user }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
    );
    return response;
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

export async function GET(request) {
  try {
    await dbConnect();
    const getAllUsers = await User.find({});
    return NextResponse.json({ users: getAllUsers }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while connecting to db",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect();
