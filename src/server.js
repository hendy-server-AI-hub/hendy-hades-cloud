const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// API Routes Mapping
app.use('/api', apiRoutes);

// Centralized Error Handler (Phải đặt ở cuối cùng sau các routes)
app.use(errorHandler);

// WebSocket Connection Handling
wss.on('connection', (ws) => {
    console.log('🔌 Client đã kết nối qua WebSocket');
    ws.on('close', () => {
        console.log('🔌 Client đã ngắt kết nối');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Hệ thống Hendy & Hades V6100 đang chạy mượt mà tại cổng ${PORT}`);
});
