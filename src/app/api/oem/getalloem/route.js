import { NextResponse } from "next/server";
import User from "@/Models/user";
import { userRoles } from "@/constants/role";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    await dbConnect();
    const getAllUsers = await User.find({ role: userRoles.OEM })
      .select("-password")
      .exec();
    return NextResponse.json({ users: getAllUsers }, { status: 200 });
  } catch (e) {
    console.log("Error while getting all oem", e);
    return NextResponse.json(
      {
        message: "Error while fetching oems",
      },
      {
        status: 500,
      }
    );
  }
}
