import dbConfig from '../configs/db.config';
import appConfig from '../configs/app.config';
import dbClient from './dbClient';

/**
 
 */
export default () => {
    try {
        dbClient.connect(
            appConfig.env === 'LOCAL'
                ? `mongodb+srv://${dbConfig.dbUsername}:${dbConfig.dbPassword}@${dbConfig.dbHost}/${dbConfig.dbName}?retryWrites=true&w=majority`
                : `mongodb://${dbConfig.dbHost}/${dbConfig.dbName}`
        );
        console.log('Connected to the MongoDB Database');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
