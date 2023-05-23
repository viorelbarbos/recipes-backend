import dotenv from 'dotenv';

dotenv.config();

const DB_HOST: string = process.env.DB_HOST || '';
const DB_NAME: string = process.env.DB_NAME || '';
const DB_USERNAME: string = process.env.DB_USERNAME || '';
const DB_PASSWORD: string = process.env.DB_PASSWORD || '';

const NEO4J_URI: string = process.env.NEO4J_URI || '';
const NEO4J_USERNAME: string = process.env.NEO4J_USERNAME || '';
const NEO4J_PASSWORD: string = process.env.NEO4J_PASSWORD || '';
const AURA_INSTANCEID: string = process.env.AURA_INSTANCEID || '';
const AURA_INSTANCENAME: string = process.env.AURA_INSTANCENAME || '';

export default {
    dbHost: DB_HOST,
    dbName: DB_NAME,
    dbUsername: DB_USERNAME,
    dbPassword: DB_PASSWORD,
    neo4jUri: NEO4J_URI,
    neo4jUsername: NEO4J_USERNAME,
    neo4jPassword: NEO4J_PASSWORD,
    auraInstanceId: AURA_INSTANCEID,
    auraInstanceName: AURA_INSTANCENAME,
};
