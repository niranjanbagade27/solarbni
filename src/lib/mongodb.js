import mongoose from "mongoose";

export default function dbConnect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        const connection = mongoose.connection;

        connection.on("connected", () => {
          console.log("MongoDB connected");
          resolve();
        });

        connection.on("error", (error) => {
          console.log("MongoDB connection error", error);
          reject(error);
        });
      })
      .catch((error) => {
        console.log("MongoDB connection error", error);
        reject(error);
      });
  });
}
