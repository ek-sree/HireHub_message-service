import mongoose from "mongoose";
import { Chat } from "../../model/Chat";
import { IChat, IMessage } from "../entities/IChat";
import { IChatRepository } from "./IChatRepository";
import Message from "../../model/Message";

export class ChatRepository implements IChatRepository {

async find(userId: string): Promise<{ success: boolean; message: string; data?: IChat[]; }> {
    try {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return { success: false, message: "Invalid userId format" };
        }

        const UserId = new mongoose.Types.ObjectId(userId);
        console.log("userIDD", UserId);
        
        const chats = await Chat.find({ participants: UserId })
            .populate({
                path: 'lastMessage',
                model: Message
            });

        if (!chats || chats.length === 0) {
            return { success: false, message: "No chats found" };
        }

        console.log("datass", chats);

        const formattedChats = chats.map(chat => ({
            _id: chat._id,
            participants: chat?.participants?.filter(p => p !== userId),
            lastMessage: chat.lastMessage
        }));
         
        return { success: true, message: "Chats found", data: formattedChats };
    } catch (error) {
        const err = error as Error;
        console.log("Error fetching chats", err);
        return { success: false, message: `Error fetching chats: ${err.message}` };
    }
}


    async createChatId(userId:string, recievedId:string):Promise<{success:boolean, message:string, data?:IChat}>{
        try {
            const senderId = new mongoose.Types.ObjectId(userId);
            const recieverId = new mongoose.Types.ObjectId(recievedId);
            let chat = await Chat.findOne({participants:{$all:[senderId, recieverId]}});
            if(chat){
                return { success: true, message: "Chat already exists", data: chat };
            }else{
                chat = new Chat({
                    participants:[senderId, recieverId]
                });
                await chat.save();
                console.log("ddddddd222222",chat);
                
                return { success: true, message: "Chat id created", data: chat };
            }
        } catch (error) {
            const err = error as Error;
            console.log("Error creating chatId", err);
            throw new Error(`Error creating chatId: ${err.message}`);
        }
    }

    async findMessages(userId: string, receiverId: string): Promise<{ success: boolean; message: string; data?: IMessage[]; }> {
        try {
            console.log("Received userId:", userId);
            console.log("Received receiverId:", receiverId);
    
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.log("Invalid userId format");
                return { success: false, message: "Invalid userId format" };
            }
            if (!mongoose.Types.ObjectId.isValid(receiverId)) {
                console.log("Invalid receiverId format");
                return { success: false, message: "Invalid receiverId format" };
            }
    console.log("userIdddddddddddddd123",userId, receiverId);
    
            const UserIdObj = new mongoose.Types.ObjectId(userId);
            const ReceiverIdObj = new mongoose.Types.ObjectId(receiverId);
    
            console.log("UserIdObj:", UserIdObj);
            console.log("ReceiverIdObj:", ReceiverIdObj);
    
            const messages = await Message.find({
                $or: [
                    { senderId: UserIdObj, recieverId: ReceiverIdObj },
                    { senderId: ReceiverIdObj, recieverId: UserIdObj }
                ]
            }).sort({ createdAt: 1 });
    
    
            if (!messages || messages.length === 0) {
                return { success: false, message: "No messages found" };
            }
    
            return { success: true, message: "Messages found", data: messages };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching messages", err);
            return { success: false, message: `Error fetching messages: ${err.message}` };
        }
    }

    async createMessage(chatId:string, content:string, senderId:string, receiverId:string):Promise<{success:boolean, message:string, data?:IMessage}>{
        try {
            console.log("dataaaaa", chatId,content,senderId, receiverId);
            
            const newMessage = new Message({
                senderId: new mongoose.Types.ObjectId(senderId),
                recieverId: new mongoose.Types.ObjectId(receiverId),
                content,
                chatId: new mongoose.Types.ObjectId(chatId)
            });
    
            const savedMessage = await newMessage.save();
            await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });

            return { success: true, message: "Message created successfully", data: savedMessage };
        } catch (error) {
            const err = error as Error;
            console.log("Error creating new messages", err);
            throw new Error(`Error creating new messages: ${err.message}`);
        }
    }
}