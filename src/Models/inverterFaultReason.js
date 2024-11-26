import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inverterFaultReasonSchema = new Schema({
  maxDropdownElements: {
    type: Number,
    required: true,
    default: 1,
  },
  srNo: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    default: "",
  },
  questionChild: {
    type: Array,
    required: true,
  },
});

const InverterFaultReason =
  mongoose.models.InverterFaultReason ||
  mongoose.model("InverterFaultReason", inverterFaultReasonSchema);

module.exports = InverterFaultReason;
