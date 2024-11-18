import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inverterFaultReasonSchema = new Schema({
  questions: {
    type: Array,
    required: true,
  },
});

const InverterFaultReason =
  mongoose.models.InverterFaultReason ||
  mongoose.model("InverterFaultReason", inverterFaultReasonSchema);

module.exports = InverterFaultReason;
