import { NextResponse } from "next/server";
import User from "@/Models/user";
import { userRoles } from "@/constants/role";
import dbConnect from "@/lib/mongodb";
export async function GET(request) {
  try {
    await dbConnect();
    const getAllUsers = await User.find({ role: userRoles.CONTRACTOR })
      .select("-password")
      .exec();
    return NextResponse.json({ users: getAllUsers }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while fetching contractors",
      },
      {
        status: 500,
      }
    );
  }
}
