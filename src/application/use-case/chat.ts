import { IChat, IMessage } from "../../domain/entities/IChat";
import { ChatRepository } from "../../domain/repositories/ChatRepository";

class ChatService {
    private chatRepo: ChatRepository;

    constructor(){
        this.chatRepo = new ChatRepository();
    }

    async getConvoUsers(userId:string): Promise<{success:boolean, message:string, data?:IChat[]}>{
        try {
            const result = await this.chatRepo.find(userId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error fetching convo users:", error);
            throw new Error(`Error fetching user convos: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async getChatId(userId:string, recievedId:string):Promise<{success:boolean, message:string, data?:IChat}>{
        try {
            const result = await this.chatRepo.createChatId(userId, recievedId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error creating chatId:", error);
            throw new Error(`Error creating chatId: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async fetchMessages(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IMessage[] }>{
        try {
            const result = await this.chatRepo.findMessages(userId, recievedId)
            if(!result || !result.success){
                return{success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw new Error(`Error fetching messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async newMessage(chatId:string, content:string, senderId:string, receiverId:string):Promise<{success:boolean, message:string, data?:IMessage}>{
        try {
            const result = await this.chatRepo.createMessage(chatId,content,senderId,receiverId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error creating  messages:", error);
            throw new Error(`Error creating  messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}

export {ChatService}