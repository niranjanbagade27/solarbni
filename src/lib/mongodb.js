import mongoose from "mongoose";

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (error) => {
      console.log("MongoDB connection error", error);
      process.exit();
    });
  } catch (e) {
    console.log("MongoDB connection error", e);
    process.exit();
  }
}
