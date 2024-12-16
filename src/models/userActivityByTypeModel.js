const { cassandraClient } = require("../config/cassandra");


async function createActivityByTypeTable(){
    const query = `CREATE TABLE IF NOT EXISTS user_activity_by_type (
        user_id UUID,
        activity_type TEXT,
        activity_name TEXT,
        activity_date TIMESTAMP,
        PRIMARY KEY ((user_id, activity_type), activity_date)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('User Activity By Type Table created');
    } catch (error) {
        console.error('There was an error when creating the User Activity By Type Table', error);
    }

}
    