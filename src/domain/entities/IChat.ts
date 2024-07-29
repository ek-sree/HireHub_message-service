import mongoose from "mongoose";

export interface IMessage{
    senderId?: string;
    recieverId?: string;
    content?:string;
    imagesUrl?:string[];
    videoUrl?:string;
    recordUrl?:string;
    chatId?:mongoose.Types.ObjectId;
}

export interface IChat{
    _id?:mongoose.Types.ObjectId;
    participants?:string[];
    lastMessage?:mongoose.Types.ObjectId; 
}

export interface IImage {
    chatId: string;
    senderId: string;
    receiverId: string;
    images?: {
        buffer: Buffer;
        originalname: string;
    }[];
}

export interface IVideo {
    chatId: string;
    senderId:string;
    receiverId: string;
    video?:{
        buffer: Buffer;
        originalname: string;
    }
}

export interface IAUdio {
    chatId: string;
    senderId:string;
    receiverId: string;
    audio?:{
        buffer: Buffer;
        originalname: string;
    }
}