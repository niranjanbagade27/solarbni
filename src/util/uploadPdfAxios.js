import { upload } from "@vercel/blob/client";
import axios from "axios";

export default async function uploadPdfAxios({ pdfFileName = "ticket", pdf }) {
  const pdfBlob = pdf.output("blob");
  const formData = new FormData();
  formData.append("pdf", pdfBlob, pdfFileName);

  try {
    const response = await axios.post("/api/uploadpdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
