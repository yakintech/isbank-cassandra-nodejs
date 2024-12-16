const { cassandraClient } = require("../config/cassandra");


async function createUserTable(){
    const query = `CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY,
        user_name TEXT,
        user_email TEXT,
        created_at TIMESTAMP    
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('User Table created');
    } catch (error) {
        console.error('There was an error when creating the User Table', error);
    }

}

module.exports = {
    createUserTable
}