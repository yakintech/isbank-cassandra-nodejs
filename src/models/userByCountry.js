const { cassandraClient } = require("../config/cassandra");

async function createUserByCountryTable(){
    const query = `CREATE TABLE IF NOT EXISTS user_by_country (
        country TEXT,
        user_id UUID,
        user_name TEXT,
        user_email TEXT,
        PRIMARY KEY (country, user_id)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('User By Country Table created');
    } catch (error) {
        console.error('There was an error when creating the User By Country Table', error);
    }

}

module.exports = {
    createUserByCountryTable
}