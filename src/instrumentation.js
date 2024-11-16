import dbConnect from "@/lib/mongodb";

export async function register() {
  await dbConnect();
}
