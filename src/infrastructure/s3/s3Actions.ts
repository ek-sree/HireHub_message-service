import { Upload } from "@aws-sdk/lib-storage";
import s3 from "./s3Config"; 
import crypto from 'crypto';
import mime from 'mime-types';
import config from "../config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function uploadFileToS3(fileBuffer: Buffer | { type: 'Buffer', data: number[] }, originalname: string): Promise<string> {
    console.log("Starting S3 upload process");
    console.log("Original filename:", originalname);
    
    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer.data);
    console.log("File buffer length:", buffer.length);
    
    const imageName = randomImageName();
    console.log("Generated image name:", imageName);
    
    const extension = originalname.split('.').pop() || '';
    const contentType = mime.lookup(extension) || 'application/octet-stream';
    console.log("Content type:", contentType);

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: config.bucketName,
            Key: imageName,
            Body: buffer,
            ContentType: contentType,
        }
    });

    try {
        console.log("Starting upload...");
        await upload.done();
        console.log("S3 upload success");
        
        // Generate a pre-signed URL
        const command = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: imageName,
        });
        
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
        console.log("Generated pre-signed URL:", signedUrl);
        
        return signedUrl;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
}

export async function fetchFileFromS3(key: string, expiresIn = 604800): Promise<string> {
    try {
        
        const command = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: key,
        });
        const url = await getSignedUrl(s3, command, { expiresIn }); 
        
        return url;
    } catch (error) {
        console.error("Error fetching file from S3:", error);
        throw error;
    }
}
