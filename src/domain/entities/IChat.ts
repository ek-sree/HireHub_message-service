import mongoose from "mongoose";

export interface IMessage{
    senderId?: string;
    recieverId?: string;
    content?:string;
    chatId?:mongoose.Types.ObjectId;
}

export interface IChat{
    _id?:mongoose.Types.ObjectId;
    participants?:string[];
    lastMessage?:mongoose.Types.ObjectId; 
}