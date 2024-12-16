const express = require('express');
const router = express.Router();
const userActivityController = require('../controllers/userActivityController');



router.post('/', userActivityController.create);
router.get('/:id', userActivityController.getUserActivities)
router.get('/activityType/:id', userActivityController.getUserActivities);