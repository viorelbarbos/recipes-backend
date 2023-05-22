import dotenv from 'dotenv';

dotenv.config();

const PORT: string = process.env.APP_PORT || '3000';
const ENV: string = process.env.ENV || 'LOCAL';
const SECRET_CODE: string = process.env.SECRET_CODE || 'secretcode';

export default {
    secretCode: SECRET_CODE,
    port: PORT,
    env: ENV,
};
