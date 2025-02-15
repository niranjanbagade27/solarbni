import { NextResponse } from "next/server";
import User from "@/Models/user";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";
export const dynamic = "force-dynamic";
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email } = body;
    const getUser = await User.findOne({
      email,
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
    const updatedUser = await User.findOneAndUpdate(
      { email: getUser.email, role: userRoles.CONTRACTOR },
      {
        fullName: getUser.fullName,
        companyName: getUser.companyName,
        gstnumber: getUser.gstnumber,
        phone: getUser.phone,
        verified: !getUser.verified,
        password: getUser.password,
      },
      { new: true, w: "majority" }
    ).select("-password");
    return NextResponse.json({ user: updatedUser });
  } catch (e) {
    console.log("Error while verifying contractor", e);
    return NextResponse.json(
      {
        message: "Error while verifying contractor",
      },
      {
        status: 500,
      }
    );
  }
}
