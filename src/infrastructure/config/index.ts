import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5005,
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017/HireHub-Post-service',
    rabbitMq_url: process.env.RABBITmq_url || '',
    bucketName: process.env.BUCKET_NAME,
    bucketRegion: process.env.BUCKET_REGION,
    bucketAccessKey: process.env.BUCKET_ACCESS_KEY,
    bucketAccessPassword: process.env.BUCKET_ACCESS_PASSWORD,
}

if(!config.rabbitMq_url) {
    console.error('RABBITmq_url is not defined in environment variables.');
    process.exit(1);
}

export default config;