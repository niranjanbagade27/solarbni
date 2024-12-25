import { NextResponse } from "next/server";
import PanelFaultReason from "@/Models/panelFaultReason";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      maxDropdownElements,
      srNo,
      question,
      questionChild,
      questionSection,
    } = body;
    const getQuestionWithSrNo = await PanelFaultReason.findOne({
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
    const newQuestion = new PanelFaultReason({
      maxDropdownElements,
      srNo,
      question,
      questionChild,
      questionSection,
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
    const questions = await PanelFaultReason.find({}).sort({ srNo: 1 });
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

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { srNo } = body;
    const getQuestionWithSrNo = await PanelFaultReason.findOne({
      srNo: srNo,
    });
    if (!getQuestionWithSrNo) {
      return NextResponse.json(
        {
          message: "Question with serial number does not exist",
        },
        {
          status: 400,
        }
      );
    }
    await PanelFaultReason.findOneAndDelete({ srNo: srNo });
    return NextResponse.json(
      {
        message: "Question deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while updating question",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    await PanelFaultReason.deleteMany({});
    return NextResponse.json(
      {
        message: "All Question deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while deleting all question",
      },
      {
        status: 500,
      }
    );
  }
}
