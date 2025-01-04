import { NextResponse } from "next/server";
import User from "@/Models/user";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";
export const dynamic = "force-dynamic";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    const sanitizedEmail = sanitizeHtml(email);
    const getUser = await User.findOne({
      email: sanitizedEmail,
      role: userRoles.CONTRACTOR,
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
    let randomString = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const hashedPassword = await bcrypt.hash(randomString, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: getUser.email, role: userRoles.CONTRACTOR },
      {
        fullName: getUser.fullName,
        companyName: getUser.companyName,
        gstnumber: getUser.gstnumber,
        phone: getUser.phone,
        verified: getUser.verified,
        password: hashedPassword,
      },
      { new: true, w: "majority" }
    );

    return NextResponse.json(
      {
        user: updatedUser,
        plainPassword: randomString,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log("Error while resting password", e);
    return NextResponse.json(
      {
        message: "Error while resting password",
      },
      {
        status: 500,
      }
    );
  }
}

dbConnect();
