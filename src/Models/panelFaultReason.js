import mongoose from "mongoose";

const Schema = mongoose.Schema;

const panelFaultReasonSchema = new Schema({
  reasons: {
    type: Array,
    required: true,
  },
});

const PanelFaultReason =
  mongoose.models.PanelFaultReason ||
  mongoose.model("PanelFaultReason", panelFaultReasonSchema);

module.exports = PanelFaultReason;
