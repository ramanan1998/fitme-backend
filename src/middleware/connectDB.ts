import mongoose from "mongoose";

const uri = process.env.MONGO_DB_URI as string;

export const connectDB = async () => {
    try{
        const connect = await mongoose.connect(uri);
        console.log("Database connected", connect.connection.name);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}