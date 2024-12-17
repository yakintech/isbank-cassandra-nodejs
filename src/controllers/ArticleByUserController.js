const { cassandraClient } = require("../config/cassandra");
const cassandra = require('cassandra-driver');



const ArticleByUserController = {
    create: async (req, res) => {
        const { user_id, article_name, article_content } = req.body;

        const query = `INSERT INTO user_articles (user_id, article_id, article_name, article_content) VALUES (?, ?, ?, ?)`;

        try {
            await cassandraClient.execute(query, [user_id, cassandra.types.Uuid.random(), article_name, article_content]);
            res.status(201).json({ message: 'Article created' });
        } catch (error) {
            console.error('There was an error when creating the article', error);
            res.status(500).json({ message: 'There was an error when creating the article' });
        }
    },
    get: async (req, res) => {
        const { user_id } = req.params;

        const query = `SELECT * FROM user_articles WHERE user_id = ?`;

        try {
            const articles = await cassandraClient.execute(query, [user_id]);
            res.status(200).json(articles.rows);
        } catch (error) {
            console.error('There was an error when getting the articles', error);
            res.status(500).json({ message: 'There was an error when getting the articles' });
        }
    }
}


module.exports = ArticleByUserController;