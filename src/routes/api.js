const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const botController = require('../controllers/botController');

// Quản lý Task
router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);

// Telegram Webhook & Dịch vụ
router.post('/telegram/webhook', botController.handleTelegramWebhook);

module.exports = router;