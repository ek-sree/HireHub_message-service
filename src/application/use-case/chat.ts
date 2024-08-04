import { IAUdio, IChat, IImage, IMessage, IVideo } from "../../domain/entities/IChat";
import { ChatRepository } from "../../domain/repositories/ChatRepository";
import { fetchFileFromS3, uploadFileToS3 } from "../../infrastructure/s3/s3Actions";

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

    async newMessage(chatId: string, content: string, images: string[],video:string,record:string,recordDuration:number, senderId: string, receiverId: string): Promise<{ success: boolean, message: string, data?: IMessage }> {
        try {
            const result = await this.chatRepo.createMessage(chatId, content,images,video,record,recordDuration, senderId, receiverId);
    
            if (!result || !result.success) {
                return { success: result.success, message: result.message };
            }
    
            return { success: result.success, message: result.message, data: result.data };
        } catch (error) {
            console.error("Error creating messages:", error);
            throw new Error(`Error creating messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async addImages(data: IImage): Promise<{ success: boolean, message: string, data?: string[] }> {
        try {            
            let imageUrls: string[] = [];
    
            if (data.images && data.images.length > 0) {
                for (const image of data.images) {
                    try {
                        const imageUrl = await uploadFileToS3(image.buffer, image.originalname);
                        imageUrls.push(imageUrl);
                        console.log(`Successfully uploaded image: ${image.originalname}, URL: ${imageUrl}`);
                    } catch (uploadError) {
                        console.error(`Error uploading image to S3:`, uploadError);
                    }
                }
            } 
    
            if (imageUrls.length === 0) {
                return { success: false, message: "No images were successfully uploaded" };
            }
                return { success: true, message: "Images uploaded successfully", data: imageUrls };
        } catch (error) {
            console.error("Error in addImages function:", error);
            return { success: false, message: `Error saving images: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }

    async addVideo(data: IVideo): Promise<{success: boolean, message:string, data?:string}>{
        try {
            let videoUrl:string='';
            if(data.video){
                videoUrl = await uploadFileToS3(data.video.buffer, data.video.originalname);
            }
            if(!videoUrl){
                return {success:false, message:"Video not uploaded to s3"}
            }
            
            return {success:true, message:"Video uploaded successfully", data:videoUrl}
        } catch (error) {
            console.error("Error in addVideo function:", error);
            return { success: false, message: `Error saving videos: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }

    async addAudio(data:IAUdio): Promise<{success: boolean, message:string, data?:string}>{
        try {
            let recordUrl: string='';
            if(data.audio){
                recordUrl = await uploadFileToS3(data.audio.buffer, data.audio.originalname);
            }
            if(!recordUrl){
                return {success:false, message:"Audio is not uploaded to s3"}
            }
            return {success:true, message:"Audio uploaded to s3", data:recordUrl}
        } catch (error) {
            console.error("Error in add audio function:", error);
            return { success: false, message: `Error saving audio: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }
}

export {ChatService}