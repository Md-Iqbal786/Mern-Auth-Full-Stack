import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";


const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigin = ['http://localhost:5173','http://localhost:5174']
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigin , credentials : true}));

app.use('/api/auth' , authRouter);
app.use('/api/user' , userRouter);


app.get("/" ,(req,res)=>{
    res.send("API is working");
})

app.listen(port , ()=>{
    console.log(`server started ay the port : ${port}`);
});