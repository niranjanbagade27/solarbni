import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  ticketName: {
    type: String,
    required: true,
  },
  contractorName: {
    type: String,
    required: true,
  },
  contactorComapny: {
    type: String,
    required: true,
  },
  contractorEmail: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerPincode: {
    type: String,
    required: true,
  },
  customerCapacity: {
    type: String,
    required: true,
  },
  installedPanelCompany: {
    type: String,
    default: "NA",
  },
  installedInverterCompany: {
    type: String,
    default: "NA",
  },
  installedPanelModel: {
    type: String,
    default: "NA",
  },
  installedInverterModel: {
    type: String,
    default: "NA",
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  ticketStatus: {
    type: String,
    required: true,
  },
  ticketCreationDate: {
    type: Date,
    required: true,
  },
  ticketCompletionDate: {
    type: Date,
  },
  ticketEmailContent: {
    type: String,
    required: true,
  },
  ticketChangedBy: {
    type: String,
  },
  sollarInstallerServicePerson: {
    type: String,
  },
  sollarInstallerServicePersonPhone: {
    type: String,
  },
});

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
