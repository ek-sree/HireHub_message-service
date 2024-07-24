import { IChat, IImage, IMessage } from "../../domain/entities/IChat";
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

    async newMessage(chatId: string, content: string, images: string[], senderId: string, receiverId: string): Promise<{ success: boolean, message: string, data?: IMessage }> {
        try {
            const result = await this.chatRepo.createMessage(chatId, content,images, senderId, receiverId);
    
            if (!result || !result.success) {
                return { success: result.success, message: result.message };
            }
    
            // let processedImages: string[] = [];
            // if (images) {
            //     if (Array.isArray(images)) {
            //         processedImages = await Promise.all(images.map(img => fetchFileFromS3(img)));
            //     } else if (typeof images === 'string') {
            //         processedImages = [await fetchFileFromS3(images)];
            //     }
            // }
            // console.log("dada proccess",processedImages);
            
            //     const updatedData = {
            //     ...result.data,
            //     imagesUrl: processedImages
            // };
    
            return { success: result.success, message: result.message, data: result.data };
        } catch (error) {
            console.error("Error creating messages:", error);
            throw new Error(`Error creating messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async addImages(data: IImage): Promise<{ success: boolean, message: string, data?: string[] }> {
        try {
            console.log("dadada", JSON.stringify({...data, images: data.images ? `${data.images.length} images` : 'No images'}));
            
            let imageUrls: string[] = [];
    
            if (data.images && data.images.length > 0) {
                console.log("Number of images to upload:", data.images.length);
                for (const image of data.images) {
                    try {
                        console.log("Processing image:", image.originalname);
                        console.log("Buffer type:", typeof image.buffer);
                        const imageUrl = await uploadFileToS3(image.buffer, image.originalname);
                        imageUrls.push(imageUrl);
                        console.log(`Successfully uploaded image: ${image.originalname}, URL: ${imageUrl}`);
                    } catch (uploadError) {
                        console.error(`Error uploading image to S3:`, uploadError);
                    }
                }
            } else {
                console.log("No images found in the data object");
            }
    
            if (imageUrls.length === 0) {
                return { success: false, message: "No images were successfully uploaded" };
            }
    
            // Return the image URLs directly
            return { success: true, message: "Images uploaded successfully", data: imageUrls };
        } catch (error) {
            console.error("Error in addImages function:", error);
            return { success: false, message: `Error saving images: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }
}

export {ChatService}