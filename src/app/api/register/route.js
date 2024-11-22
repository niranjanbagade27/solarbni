import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";
import sanatizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role } = body;
    const sanitizedEmail = sanatizeHtml(email);
    const sanitizedPassword = sanatizeHtml(password);
    const sanitizedFirstName = sanatizeHtml(firstName);
    const sanitizedLastName = sanatizeHtml(lastName);
    const sanitizedRole = sanatizeHtml(role);
    const getUser = await User.findOne({ email: sanitizedEmail });
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
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
    const user = new User({
      email: sanitizedEmail,
      password: hashedPassword,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      role: sanitizedRole,
    });
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

dbConnect();
