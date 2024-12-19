import { upload } from "@vercel/blob/client";

export default async function uploadPdf({ pdfFileName, pdf }) {
  const pdfBlob = pdf.output("blob");
  const newBlob = await upload(pdfFileName, pdfBlob, {
    access: "public",
    handleUploadUrl: "/api/uploadpdf",
    name: pdfFileName,
  });
  return newBlob;
}
