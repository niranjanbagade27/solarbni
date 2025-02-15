import { NextResponse } from "next/server";
import User from "@/Models/user";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/mongodb";
import { userRoles } from "@/constants/role";
export const dynamic = "force-dynamic";
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password, fullName, companyName, gstNumber, phone } = body;
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedfullName = sanitizeHtml(fullName);
    const sanitizedcompanyName = sanitizeHtml(companyName);
    const sanitizedGstNumber = sanitizeHtml(gstNumber);
    const sanitizedPhone = sanitizeHtml(phone);
    const sanitizedPassword = sanitizeHtml(password);
    const getUser = await User.findOne({
      email: sanitizedEmail,
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
    const updatedUser = await User.findOneAndUpdate(
      { email: sanitizedEmail, role: userRoles.OEM },
      {
        fullName: sanitizedfullName,
        companyName: sanitizedcompanyName,
        gstnumber: sanitizedGstNumber,
        phone: sanitizedPhone,
        ...(sanitizedPassword && { password: sanitizedPassword }),
      },
      { new: true, w: "majority" }
    ).select("-password");
    return NextResponse.json({ user: updatedUser });
  } catch (e) {
    console.log("Error while updating oem", e);
    return NextResponse.json(
      {
        message: "Error while updating oem",
      },
      {
        status: 500,
      }
    );
  }
}
