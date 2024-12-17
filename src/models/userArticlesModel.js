const { cassandraClient } = require("../config/cassandra");



const createUserArticlesTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS user_articles (
        user_id UUID,
        article_id UUID,
        article_name TEXT,
        article_content TEXT,
        PRIMARY KEY (user_id, article_id)
    )`;

    try {
        await cassandraClient.execute(query);
        console.log('User Articles Table created');
    } catch (error) {
        console.error('There was an error when creating the User Articles Table', error);
    }

}

module.exports = {
    createUserArticlesTable
}