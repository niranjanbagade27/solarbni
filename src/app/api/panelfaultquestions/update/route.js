import { NextResponse } from "next/server";
import PanelFaultReason from "@/Models/panelFaultReason";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { questions } = body;
    for (const ques of questions) {
      const {
        id,
        srNo,
        questionSection,
        question,
        questionChild,
        maxDropdownElements,
      } = ques;
      await PanelFaultReason.findByIdAndUpdate(id, {
        srNo,
        questionSection,
        question,
        questionChild,
        maxDropdownElements,
      });
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
    console.log("Error while updating panel question", e);
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
