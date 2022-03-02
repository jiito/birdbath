import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL as string;
if (!MONGODB_URI) {
  console.error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

async function dbConnect() {
  console.info("[dbConnect]: Starting new connection");
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
  };

  return await mongoose.connect(MONGODB_URI, opts).catch((err) => {
    console.log("Error while connecting to MongoDB");
    console.log(err);
  });
}

export default dbConnect;
