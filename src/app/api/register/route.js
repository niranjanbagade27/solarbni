import { NextResponse } from "next/server";
import User from "@/Models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      companyName,
      role,
      gstNumber,
      phone,
      officeAddress,
      pincode,
    } = body;
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
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      companyName,
      role,
      gstnumber: gstNumber,
      phone,
      verified: false,
      officeAddress,
      pincode,
    });
    await user.save();
    const { password: savedUserPassword, ...userDetailsWithoutPassword } =
      user.toObject();
    return NextResponse.json({ user: userDetailsWithoutPassword });
  } catch (e) {
    console.log("Error while registering user", e);
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
