import neo4j from './neo4jClient';
import dbConfig from '../configs/db.config';
export default () => {
    try {
        const driver = neo4j.driver(
            dbConfig.neo4jUri,
            neo4j.auth.basic(dbConfig.neo4jUsername, dbConfig.neo4jPassword)
        );

        return driver;
    } catch (error: any) {
        console.log(error);
    }
};
