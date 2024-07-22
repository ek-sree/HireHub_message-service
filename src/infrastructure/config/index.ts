import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5005,
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017/HireHub-Post-service',
    rabbitMq_url: process.env.RABBITmq_url || '',
}

if(!config.rabbitMq_url) {
    console.error('RABBITmq_url is not defined in environment variables.');
    process.exit(1);
}

export default config;