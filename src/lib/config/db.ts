import mongoose from "mongoose";

type Cached = {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
};

const MONGO_URI = process.env.MONGO_URI;
const cached: Cached = {};

export const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  if (cached.connection) {
    console.log("DB connected already");
    return cached.connection;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, options);
  }

  try {
    cached.connection = await cached.promise;
    console.log("New DB connected");
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  return cached.connection;
};
