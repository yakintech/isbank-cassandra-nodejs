const express = require('express');
const userController = require('./src/controllers/userController');
const userActivityController = require('./src/controllers/userActivityController');
const { cassandraClient, connectToCassandra } = require('./src/config/cassandra');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;

app.use(express.json());

//user endpoints
app.post('/api/users', userController.create);



//user activity endpoints
app.post("/api/user-activity", userActivityController.create);
app.post("/api/user-activity/ttl", userActivityController.createByTTL);

app.get("/api/user-activity/:id", userActivityController.getUserActivities);
app.get("/api/user-activity/by-date-range/:id", userActivityController.getActivitiesByDateRange);
app.get("/api/user-activity/activityType/:id", userActivityController.getActivitiesByType);
app.get("/api/user-activity/last/:id", userActivityController.getLastActivity);
app.get("/api/user-activity/count/:id", userActivityController.getTotalActivityByUserId);

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
        cassandraClient.metadata.getTable('isbank-ecommerce', 'user_activity')
        .then(table => {
            console.log('Table information:', table);
        })
        .catch(error => {
            console.error('Error getting table metadata:', error);
        });


    })
    .catch(error => {
        console.error('Error connecting to Cassandra:', error);
    });