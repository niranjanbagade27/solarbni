import { NextResponse } from "next/server";
import InverterFaultReason from "@/Models/inverterFaultReason";
import { capitalizeFirstLetter } from "@/util/capitalizeFirstLetter";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    await dbConnect();
    const inverterFaultReasons = await InverterFaultReason.find();
    return NextResponse.json({ inverterFaultReasons });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while fetching panel fault questions",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { question } = body;
    const getCategory = await InverterFaultReason.find();
    const id = getCategory[0]._id;
    const newQuestions = [
      ...getCategory[0].questions,
      capitalizeFirstLetter(question),
    ];
    const updatedCategory = await InverterFaultReason.findByIdAndUpdate(
      id,
      { questions: newQuestions },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        {
          message: "Error while adding new questions",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "Questions added successfully" });
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

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { question } = body;
    const getCategory = await InverterFaultReason.find();
    const id = getCategory[0]._id;
    const newQuestions = getCategory[0].questions.filter(
      (reason) => reason !== question
    );
    const updatedCategory = await InverterFaultReason.findByIdAndUpdate(
      id,
      { questions: newQuestions },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        {
          message: "Error while removing questions",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "questions removed successfully" });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while removing questions",
      },
      {
        status: 500,
      }
    );
  }
}
