import mongoose, { Schema } from "mongoose";
import { IMessage } from "../domain/entities/IChat";

export interface IMessageDocument extends IMessage, Document{}


const MessageSchema: Schema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    recieverId: {
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    imagesUrl:{
        type:[String],
        default:[]
    },
    videoUrl:{
        type:String,
        default:''
    },
    recordUrl:{
        type:String,
        default:''
    },
    recordDuration:{
        type:Number,
        default:0
    },
    read:{
        type:Boolean,
        default:false
    },
    chatId:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    }
},{timestamps:true})

export default mongoose.model<IMessageDocument>("Message", MessageSchema);