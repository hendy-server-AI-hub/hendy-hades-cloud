const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const botController = require('../controllers/botController');

// Task Endpoints
router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);

// Telegram & SMM Endpoints
router.post('/telegram/webhook', botController.handleTelegramWebhook);
router.post('/smm/order', botController.processSMMOrder);

module.exports = router;
