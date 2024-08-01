import { ChatService } from "../application/use-case/chat";
import { IAUdio, IImage, IVideo } from "../domain/entities/IChat";

class ChatController {
    private chatService: ChatService;

    constructor(){
        this.chatService = new ChatService();
    }

    async fetchConvoUsers(data:{userId:string}){
        try {
            const userId = data.userId;
            
            const result = await this.chatService.getConvoUsers(userId);
            return result;
        } catch (error) {
            console.error("Error fetching convo user datas:", error);
            throw error;
        }
    }

    async fetchChatId(data:{userId:string, recievedId:string}){
        try {
            const userId = data.userId;
            const recievedId = data.recievedId;
            const result = await this.chatService.getChatId(userId, recievedId);
            return result;
        } catch (error) {
            console.error("Error creating chatId:", error);
            throw error;
        }
    }

    async getMessages(data:{userId:string, recievedId:string}){
        try {
            const userId = data.userId;
            const recievedId =data.recievedId;
            const result = await this.chatService.fetchMessages(userId, recievedId);
            return result;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    }
    
    async saveNewMessage(data:{chatId:string, content:string,images:string[],video:string,record:string, recordDuration:number, senderId:string, receiverId:string}){
        try {
            
            const chatId = data.chatId;
            const content = data.content;
            const images = data.images;
            const video= data.video;
            const record = data.record;
            const recordDuration = data.recordDuration
            const senderId = data.senderId;
            const recieverId = data.receiverId;
            
            const result = await this.chatService.newMessage(chatId,content,images,video,record,recordDuration, senderId, recieverId);
            return result;
        } catch (error) {
            console.error("Error creating messages:", error);
            throw error;
        }
    }

    async saveImages(data:IImage){
        try {
            
            const result = await this.chatService.addImages(data)
            return result;
        } catch (error) {
            console.error("Error saving images:", error);
            throw error;
        }
    }

    async saveVideo(data:IVideo){
        try {
            const result = await this.chatService.addVideo(data);
            return result;
        } catch (error) {
            console.error("Error saving video:", error);
            throw error;
        }
    }

    async saveAudio(data: IAUdio){
        try {
            const result = await this.chatService.addAudio(data);
            return result;
        } catch (error) {
            console.error("Error saving audio:", error);
            throw error;
        }
    }
}

export const chatController = new ChatController();