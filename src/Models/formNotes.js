import mongoose from "mongoose";

const Schema = mongoose.Schema;

const formNotesSchema = new Schema({
  notes: {
    type: Array,
    required: true,
  },
});

const FormNotesSchema =
  mongoose.models.FormNotesSchema ||
  mongoose.model("FormNotesSchema", formNotesSchema);

module.exports = FormNotesSchema;
