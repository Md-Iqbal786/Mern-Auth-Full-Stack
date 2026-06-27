import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("DataBase Connected Successfully");
    });

    mongoose.connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
    });

    const mongoURI = process.env.MONGO_URI || "mongodb+srv://Iqbal_Zcode:Iqbal%40786@octadb.e1ee9en.mongodb.net/?appName=OctaDB";
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
