const { cassandraClient } = require("../config/cassandra");
const { v4: uuidv4 } = require('uuid');
const cassandra = require('cassandra-driver');





const productController = {
    create: async (req, res) => {
        const product_id = cassandra.types.Uuid.fromString(uuidv4());
        const product_price = parseFloat(req.body.product_price);
        const { category, product_name } = req.body;

        console.log("product_price", product_price);

        const query = `INSERT INTO product_by_category (category, product_id, product_name, product_price) VALUES (?, ?, ?, ?)`;

        try {
            await cassandraClient.execute(query, [category, product_id, product_name, product_price]);
            res.status(201).json({ message: 'Product created' });
        } catch (error) {
            console.error('There was an error when creating the product', error);
            res.status(500).json({ message: 'There was an error when creating the product' });
        }
    },
    getByCategory: async (req, res) => {
        const { category } = req.params;

        console.log("category", category);
        const query = `SELECT * FROM product_by_category WHERE category = ?`;

        try {
            const products = await cassandraClient.execute(query, [category]);
            res.status(200).json(products.rows);
        } catch (error) {
            console.error('There was an error when getting the products', error);
            res.status(500).json({ message: 'There was an error when getting the products' });
        }
    }
}

module.exports = productController;