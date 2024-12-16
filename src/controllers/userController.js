const { cassandraClient } = require("../config/cassandra");
const {v4: uuidv4} = require('uuid');


const userController = {

    getById: async (req,res) => {
        const userId = req.params.id;
        const query = 'SELECT * FROM users WHERE user_id = ?';

        const result = await cassandraClient.execute(query, [userId], { prepare: true });
        return res.json(result.rows[0]);
    },
    create: async (req,res) => {
        const user_id = uuidv4();
        const { user_name, user_email } = req.body;
        const query = 'INSERT INTO users (user_id, user_name, user_email, created_at) VALUES (?, ?, ?, toTimeStamp(now()))';

        await cassandraClient.execute(query, [user_id, user_name, user_email], { prepare: true });
        return res.json({ message: 'User created' });
    }

}

module.exports = userController;