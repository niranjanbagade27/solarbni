import { NextResponse } from "next/server";
import InverterFaultReason from "@/Models/inverterFaultReason";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { maxDropdownElements, srNo, question, questionChild } = body;
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

export async function GET() {
  try {
    await dbConnect();
    const questions = await InverterFaultReason.find({}).sort({ srNo: 1 });
    return NextResponse.json(
      {
        questions,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while fetching inverter questions",
      },
      {
        status: 500,
      }
    );
  }
}
