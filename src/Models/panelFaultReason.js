import mongoose from "mongoose";

const Schema = mongoose.Schema;

const panelFaultReasonSchema = new Schema({
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
  uniqueDropdownCount: {
    type: Number,
  },
  questionChild: {
    type: Array,
    required: true,
  },
  questionSection: {
    type: Number,
    required: true,
    default: 1,
  },
});

const PanelFaultReason =
  mongoose.models.PanelFaultReason ||
  mongoose.model("PanelFaultReason", panelFaultReasonSchema);

module.exports = PanelFaultReason;
