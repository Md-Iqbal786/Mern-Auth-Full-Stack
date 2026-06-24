import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("DataBase Connected Successfully");
    });

    mongoose.connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
    });

    const mongoURI = process.env.MONGO_URI || "mongodb+srv://mriqbal104786_db_user:jIpGGRDO2X4nkxXq@cluster0.ka9tzkp.mongodb.net/";
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
