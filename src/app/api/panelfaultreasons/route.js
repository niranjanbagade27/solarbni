import { NextResponse } from "next/server";
import PanelFaultReason from "@/Models/panelFaultReason";
import { capitalizeFirstLetter } from "@/util/capitalizeFirstLetter";
export async function GET(request) {
  try {
    const panelFaultReasons = await PanelFaultReason.find();
    return NextResponse.json({ panelFaultReasons });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while fetching panel fault reasons",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category } = body;
    const getCategory = await PanelFaultReason.find();
    const id = getCategory[0]._id;
    const newCategory = [
      ...getCategory[0].reasons,
      capitalizeFirstLetter(category),
    ];
    const updatedCategory = await PanelFaultReason.findByIdAndUpdate(
      id,
      { reasons: newCategory },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        {
          message: "Error while adding new category",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "Category added successfully" });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while adding new category",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { category } = body;
    const getCategory = await PanelFaultReason.find();
    const id = getCategory[0]._id;
    const newCategory = getCategory[0].reasons.filter(
      (reason) => reason !== category
    );
    const updatedCategory = await PanelFaultReason.findByIdAndUpdate(
      id,
      { reasons: newCategory },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        {
          message: "Error while removing category",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "Category removed successfully" });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while removing category",
      },
      {
        status: 500,
      }
    );
  }
}
