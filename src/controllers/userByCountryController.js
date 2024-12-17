const { cassandraClient } = require("../config/cassandra");
const cassandra = require('cassandra-driver');



const userbyCountryController = {
    create: async (req, res) => {
        const { country, user_name, user_email } = req.body;

        const query = `INSERT INTO user_by_country (country, user_id, user_name, user_email) VALUES (?, ?, ?, ?)`;

        try {
            await cassandraClient.execute(query, [country, cassandra.types.Uuid.random(), user_name, user_email]);
            res.status(201).json({ message: 'User created' });
        } catch (error) {
            console.error('There was an error when creating the user', error);
            res.status(500).json({ message: 'There was an error when creating the user' });
        }
    },
    get: async (req, res) => {
        const { country } = req.params;

        const query = `SELECT * FROM user_by_country WHERE country = ?`;

        try {
            const users = await cassandraClient.execute(query, [country]);
            res.status(200).json(users.rows);
        } catch (error) {
            console.error('There was an error when getting the users', error);
            res.status(500).json({ message: 'There was an error when getting the users' });
        }
    }
}

module.exports = userbyCountryController;