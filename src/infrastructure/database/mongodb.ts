import mongoose from "mongoose";
import config from "../config";

export const connectToDatabase = async()=>{
    try {
        await mongoose.connect(config.dbUri);
        console.log("Connected to databse");
        
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}