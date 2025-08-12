import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/pingup`);
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1); // stop the app if DB fails
  }
};

export default connectDB;
