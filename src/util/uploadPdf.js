import { upload } from "@vercel/blob/client";

export default async function uploadPdf({ pdfFileName = "ticket", pdf }) {
  const pdfBlob = pdf.output("blob");
  const newBlob = await upload(pdfFileName, pdfBlob, {
    access: "public",
    handleUploadUrl: "/api/uploadpdf",
  });
  return newBlob;
}
