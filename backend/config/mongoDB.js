import mongoose from "mongoose";



const connectDB = async ()=>{

    mongoose.connection.on('connected' , ()=>{
        console.log("DataBase Connected ");
    })
    await mongoose.connect(process.env.MONGO_URI ||"mongodb+srv://mriqbal104786_db_user:jIpGGRDO2X4nkxXq@cluster0.ka9tzkp.mongodb.net/");
}

export default connectDB;
