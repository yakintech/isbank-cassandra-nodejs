const { cassandraClient } = require("../config/cassandra");


const userActivityController = {
    create: async (req, res) => {
        const activity_date = new Date();
        const { user_id, activity_name, activity_type } = req.body;

        const query = 'INSERT INTO user_activity (user_id, activity_name, activity_type, activity_date) VALUES (?, ?, ?, ?)';
        await cassandraClient.execute(query, [user_id, activity_name, activity_type, activity_date], { prepare: true });
        return res.json({ message: 'User activity created' });
    },
    createByTTL: async (req,res) => {
        //TTL 1 dakika
        const query = `INSERT INTO user_activity (user_id, activity_name, activity_type, activity_date) VALUES (?, ?, ?, ?) USING TTL 60`;

        const activity_date = new Date();
        const { user_id, activity_name, activity_type } = req.body;

        await cassandraClient.execute(query, [user_id, activity_name, activity_type, activity_date], { prepare: true });
        return res.json({ message: 'User activity created with TTL' });
    },

    getUserActivities(req, res) {
        const user_id = req.params.id;
        const query = 'SELECT * FROM user_activity WHERE user_id = ? ORDER BY activity_date DESC';
        cassandraClient.execute(query, [user_id], { prepare: true })
            .then(result => {
                return res.json(result.rows);
            })
            .catch(error => {
                console.error('There was an error when getting the user activities', error);
            });
    },
    getActivitiesByDateRange(req, res) {
        const user_id = req.params.id;
        const { start_date, end_date } = req.query;

        //date sample startdate: 2021-01-01, enddate: 2021-01-31

        const query = 'SELECT * FROM user_activity WHERE user_id = ? AND activity_date >= ? AND activity_date <= ?';
        cassandraClient.execute(query, [user_id, start_date, end_date], { prepare: true })
            .then(result => {
                return res.json(result.rows);
            })
            .catch(error => {
                console.error('There was an error when getting the user activities', error);
            });
    },
    getActivitiesByType: async (req, res) => {
        const user_id = req.params.id;
        const activity_type = req.query.activity_type;

        const query = 'SELECT * FROM user_activity WHERE user_id = ? AND activity_type = ? ALLOW FILTERING';

        const result = await cassandraClient.execute(query, [user_id, activity_type], { prepare: true });

        return res.json(result.rows);

    },
    updateActivity: async (req, res) => {
        const { user_id, activity_date, activity_name, activity_type } = req.body;
        const query = 'UPDATE user_activity SET activity_name = ?, activity_type = ? WHERE user_id = ? AND activity_date = ?';

        await cassandraClient.execute(query, [activity_name, activity_type, user_id, activity_date], { prepare: true });
    },
    deleteActivity: async (req, res) => {
        const { user_id, activity_date } = req.body;
        const query = 'DELETE FROM user_activity WHERE user_id = ? AND activity_date = ?';

        await cassandraClient.execute(query, [user_id, activity_date], { prepare: true });
    },
    //bir kullanıcının en SON yaptığı aktiviteyi getirir.
    getLastActivity: async (req,res) => {
        const query = `SELECT * FROM user_activity WHERE user_id = ? ORDER BY activity_date DESC LIMIT 1`;

        const result = await cassandraClient.execute(query, [req.params.id], { prepare: true });
        return res.json(result.rows[0]);
    },
    getTotalActivityByUserId: async (req,res) => {
        const query = `SELECT COUNT(*) FROM user_activity WHERE user_id = ?`;

        const result = await cassandraClient.execute(query, [req.params.id], { prepare: true });
        return res.json(result.rows[0]);
    }
}


module.exports = userActivityController;


//  ALLOW FILTERING Özellikleri
// 1. ALLOW FILTERING, WHERE koşullarında kullanılan bir özelliktir.
// 2. Büyük veri kümelerinde performans sorunlarına neden olabilir.
// 3. Cassandra burada sorguyu tüm veri kümesi üzerinde çalıştırır ve filtreleme işlemini yapar.

//COUNT VEYA DİĞER AGGREGATE FONKSİYONLARINI CASSANDRA DİREKT DESTEKLEMEZ.


// CASSANDRA TTL (Time To Live) Özelliği
//Kayıtların belirli bir süre sonra silinmesini sağlar.
// TTL bir kere ayarlandıktan sonra değiştirilemez.

// user_id UUID,
// activity_name TEXT,
// activity_type TEXT,
// activity_date TIMESTAMP,
// PRIMARY KEY (user_id, activity_date)