import mongoose from "mongoose";

const Schema = mongoose.Schema;

const formNotesSchema = new Schema({
  notes: {
    type: String,
    required: true,
  },
});

const FormNotes =
  mongoose.models.FormNotes || mongoose.model("FormNotes", formNotesSchema);

module.exports = FormNotes;
