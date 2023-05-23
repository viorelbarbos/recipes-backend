import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import appConfig from './configs/app.config';
import dbConnect from './database/mongoDB/dbConnect';
import v1 from './api/v1';
import neo4jConnect from './database/ne04j/neo4jConnect';

dotenv.config();

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

//express session
app.use(
    session({
        secret: appConfig.secretCode,
        resave: true,
        saveUninitialized: true,
    })
);

//middleware which parses cookies attached to the client request object
app.use(cookieParser());

//connect to db
dbConnect();

//connect to neo4j
neo4jConnect();

app.use('/v1', v1);

app.listen(appConfig.port, () => {
    console.log(`App started at port ${appConfig.port}`);
});
