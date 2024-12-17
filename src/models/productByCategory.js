const { cassandraClient } = require("../config/cassandra");


async function createProductByCategoryTable(){
    const query = `CREATE TABLE IF NOT EXISTS product_by_category (
        category TEXT,
        product_id UUID,
        product_name TEXT,
        product_price INT,
        PRIMARY KEY (category, product_id)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('Product By Category Table created');
    } catch (error) {
        console.error('There was an error when creating the Product By Category Table', error);
    }

}

module.exports = {
    createProductByCategoryTable
}