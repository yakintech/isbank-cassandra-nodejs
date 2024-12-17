const express = require('express');
const userActivityController = require('./src/controllers/userActivityController');
const { cassandraClient, connectToCassandra } = require('./src/config/cassandra');
const { createProductByCategoryTable } = require('./src/models/productByCategory');
const { createUserByCountryTable } = require('./src/models/userByCountry');
const { createOrderByUserTable } = require('./src/models/orderByUser');
const productController = require('./src/controllers/productController');
const userbyCountryController = require('./src/controllers/userByCountryController');
const { createUserArticlesTable } = require('./src/models/userArticlesModel');
const ArticleByUserController = require('./src/controllers/ArticleByUserController');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;

app.use(express.json());



//user activity endpoints
app.post("/api/user-activity", userActivityController.create);
app.post("/api/user-activity/ttl", userActivityController.createByTTL);

app.get("/api/user-activity/:id", userActivityController.getUserActivities);
app.get("/api/user-activity/by-date-range/:id", userActivityController.getActivitiesByDateRange);
app.get("/api/user-activity/activityType/:id", userActivityController.getActivitiesByType);
app.get("/api/user-activity/last/:id", userActivityController.getLastActivity);
app.get("/api/user-activity/count/:id", userActivityController.getTotalActivityByUserId);



//user by country routes
app.post("/api/user/bycountry", userbyCountryController.create);
app.get("/api/user/bycountry/:country", userbyCountryController.get);

//article routes
app.post("/api/user/article", ArticleByUserController.create);
app.get("/api/user/article/:user_id", ArticleByUserController.get);



//product routes
app.post("/api/product/bycategory", productController.create);
app.get("/api/product/bycategory/:category", productController.getByCategory);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


connectToCassandra()
    .then(res => {
        //consistency samples for select queries
        // const query = 'SELECT * FROM user_activity WHERE user_id = ?';
        // const userId = '4d475efc-36dd-4f82-be23-90700426e4fd'

        // cassandraClient.execute(query, [userId], { prepare: true, consistency: cassandra.types.consistencies.one })
        //     .then(result => {
        //         console.log(result.rows);
        //     })
        //     .catch(error => {
        //         console.error('Error executing query:', error);
        //     });

        //TRUNCATE TABLE user_activity;
        // cassandraClient.execute('TRUNCATE TABLE user_activity')
        // .then(result => {
        //     console.log('user_activity table truncated');
        // })
        //TRUNCATE komutu ile user_activity tablosunu temizleyebilirsiniz.


        //DESCRIBE user_activity;
        //DESCRIBE komutu ile tablo yapısını görebilirsiniz.
        // cassandraClient.metadata.getTable('isbank-ecommerce', 'user_activity')
        // .then(table => {
        //     console.log('Table information:', table);
        // })
        // .catch(error => {
        //     console.error('Error getting table metadata:', error);
        // });

         //createProductByCategoryTable();
        // createUserByCountryTable();
        // createOrderByUserTable();
        // createUserArticlesTable();

    })
    .catch(error => {
        console.error('Error connecting to Cassandra:', error);
    });