import { chatController } from '../../interface/chatController';
import RabbitMQClient from './client';

export default class MessageHandler{
    static async handle(operation: string, data:any, correlationId:string, replyTo:string){
        let response;

        switch(operation) {
            
            case 'convo-users':
                response = await chatController.fetchConvoUsers(data);
                break;

            case 'get-chatId':
                response = await chatController.fetchChatId(data);
                break;  
                
            case 'fetch-message':
                response = await chatController.getMessages(data);
                break;    

            case 'save-message':
                response = await chatController.saveNewMessage(data);
                break;
                
            case 'save-image':
                response = await chatController.saveImages(data);
                break;   
                
            case 'save-video':
                response = await chatController.saveVideo(data);
                break;    

        default:
            response = {error: "Operation not supported"};
            break;    
        }
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}