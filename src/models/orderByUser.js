const { cassandraClient } = require("../config/cassandra");


async function createOrderByUserTable(){
    const query = `CREATE TABLE IF NOT EXISTS order_by_user (
        user_id UUID,
        order_id UUID,
        order_date TIMESTAMP,
        order_status TEXT,
        order_total FLOAT,
        PRIMARY KEY (user_id, order_id)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('Order By User Table created');
    } catch (error) {
        console.error('There was an error when creating the Order By User Table', error);
    }

}

module.exports = {
    createOrderByUserTable
}