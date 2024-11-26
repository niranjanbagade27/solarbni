import { NextResponse } from "next/server";
import InverterFaultReason from "@/Models/inverterFaultReason";
import { capitalizeFirstLetter } from "@/util/capitalizeFirstLetter";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { maxDropdownElements, srNo, question="", questionChild } = body;
    console.log("###", maxDropdownElements, srNo, question, questionChild);
    const getQuestionWithSrNo = await InverterFaultReason.findOne({
      srNo: srNo,
    });
    if (getQuestionWithSrNo) {
      return NextResponse.json(
        {
          message: "Question with same serial number already exists",
        },
        {
          status: 400,
        }
      );
    }
    const newQuestion = new InverterFaultReason({
      maxDropdownElements,
      srNo,
      question,
      questionChild,
    });
    await newQuestion.save();
    return NextResponse.json(
      {
        message: "New question added successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while adding new question",
      },
      {
        status: 500,
      }
    );
  }
}
