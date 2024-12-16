const cassandra = require('cassandra-driver');
require('dotenv').config();


const sslOptions = {
    rejectAuthorized: false,
    checkServerIdentity: () => undefined
}


const cassandraClient = new cassandra.Client({
    contactPoints:process.env.CASSANDRA_CONTACT_POINTS.split(','),
    localDataCenter: 'West US 2',
    authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USER_NAME , process.env.CASSANDRA_PASSWORD),
    sslOptions: sslOptions,
    keyspace: 'isbank-ecommerce'
});


async function connectToCassandra() {
    try {
        await cassandraClient.connect();
        console.log('Connected to Cassandra');
    } catch (error) {
        console.error('There was an error when connecting', error);
    }
}

module.exports = {
    connectToCassandra,
    cassandraClient
}