import { NextResponse } from "next/server";
import User from "@/Models/user";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";
export const dynamic = "force-dynamic";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';


export async function PUT(request) {
  try {
    const body = await request.json();
    const { password } = body;
    console.log(password)
    const getUser = await User.findOne({
      role: userRoles.ADMIN,
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
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const updatedUser = await User.findOneAndUpdate(
      { role: userRoles.ADMIN },
      {
        fullName: getUser.fullName,
        companyName: getUser.companyName,
        gstnumber: getUser.gstnumber,
        phone: getUser.phone,
        verified: getUser.verified,
        password: hashedPassword,
      },
      { new: true, w: "majority" }
    )

    return NextResponse.json(
      {
        user: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        message: "Error while searching contractor",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect();
