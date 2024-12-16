const { cassandraClient } = require("../config/cassandra");


//create user activity table
//örneğin ürünü sepete ekledi, ürünü satın aldı, ürünü favorilere ekledi gibi aktiviteleri tutmak için
async function createUserActivityTable() {
    const query = `CREATE TABLE IF NOT EXISTS user_activity (
        user_id UUID,
        activity_name TEXT,
        activity_type TEXT,
        activity_date TIMESTAMP,
        PRIMARY KEY (user_id, activity_date)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('User Activity Table created');
    } catch (error) {
        console.error('There was an error when creating the User Activity Table', error);
    }
}

//user_id kolou hem primary hem de partition key olarak kullanılıyor. Partition key verinin hangi node'da saklanacağını belirler.
//activity_date kolonu clustering key olarak kullanılıyor. Clustering key verinin sıralanma şeklini belirler.


module.exports = {
    createUserActivityTable
}