import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

async function authorize() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
  } = process.env;

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  // Set the refresh token
  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  // Refresh the access token
  await oAuth2Client.getAccessToken();

  return oAuth2Client;
}

async function uploadFileToDrive(auth, filePath, fileName) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });
  return response.data.id;
}

export default async function uploadPdf(req, res) {
  const auth = await authorize();
  const file = req.file;
  const filePath = path.join(process.cwd(), file.path);
  const fileName = `${file.originalname}.pdf`;

  try {
    const fileId = await uploadFileToDrive(auth, filePath, fileName);
    res.status(200).json({ fileId });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).json({ error: "Failed to upload file to Google Drive" });
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  }
}

// Middleware to handle file upload
export const uploadMiddleware = upload.single("pdf");
