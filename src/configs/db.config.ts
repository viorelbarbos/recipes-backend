import dotenv from 'dotenv';

dotenv.config();

const DB_HOST: string = process.env.DB_HOST || '';
const DB_NAME: string = process.env.DB_NAME || '';
const DB_USERNAME: string = process.env.DB_USERNAME || '';
const DB_PASSWORD: string = process.env.DB_PASSWORD || '';

export default {
    dbHost: DB_HOST,
    dbName: DB_NAME,
    dbUsername: DB_USERNAME,
    dbPassword: DB_PASSWORD,
};
