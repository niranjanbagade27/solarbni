import { NextResponse } from "next/server";
import PanelFaultReason from "@/Models/panelFaultReason";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { questions } = body;
    for (const question of questions) {
      const { id, srNo, questionSection } = question;
      await PanelFaultReason.findByIdAndUpdate(id, { srNo, questionSection });
    }
    return NextResponse.json(
      {
        message: "Questions updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while updating panel question",
      },
      {
        status: 500,
      }
    );
  }
}
