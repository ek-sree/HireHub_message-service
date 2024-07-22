import { ChatService } from "../application/use-case/chat";

class ChatController {
    private chatService: ChatService;

    constructor(){
        this.chatService = new ChatService();
    }

    async fetchConvoUsers(data:{userId:string}){
        try {
            const userId = data.userId;
            console.log("UserId", userId);
            
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
    
    async saveNewMessage(data:{chatId:string, content:string, senderId:string, receiverId:string}){
        try {
            const chatId = data.chatId;
            const content = data.content;
            const senderId = data.senderId;
            const recieverId = data.receiverId;
            const result = await this.chatService.newMessage(chatId,content, senderId, recieverId);
            return result;
        } catch (error) {
            console.error("Error creating messages:", error);
            throw error;
        }
    }
}

export const chatController = new ChatController();