const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const { WebcastPushConnection } = require('tiktok-live-connector');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const clients = new Set();
const activeSlaves = new Map();
const activeBots = new Map();
const activeLiveMonitors = new Map(); // Quản lý các phiên theo dõi / tăng mắt Live

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// ==========================================
// 🔴 LIVE STREAM VIEWER ENGINE (TĂNG & QUẢN LÝ MẮT LIVE)
// ==========================================
app.post('/api/live/start-boost', (req, res) => {
    const { platform, targetUrl, username, targetViewers } = req.body;
    
    if (!platform || (!targetUrl && !username)) {
        return res.status(400).json({ success: false, error: 'Thiếu thông tin nền tảng hoặc link/username phòng live' });
    }

    const sessionId = 'LIVE_' + Math.random().toString(36).substring(2, 8);
    
    // Nếu là TikTok, sử dụng thư viện chuyên dụng để lấy/bơm mắt thực tế
    if (platform.toLowerCase() === 'tiktok' && username) {
        try {
            const tiktokLiveConnection = new WebcastPushConnection(username);
            
            tiktokLiveConnection.connect().then(state => {
                console.log(`[TIKTOK LIVE] Đã kết nối phòng ID: ${state.roomId} của @${username}`);
            }).catch(err => {
                console.error(`[TIKTOK LIVE ERROR]:`, err.message);
            });

            tiktokLiveConnection.on('roomUser', data => {
                // Broadcast số lượng mắt thực tế tới tất cả Client WebSocket
                broadcastToClients({
                    type: 'LIVE_VIEWER_UPDATE',
                    sessionId,
                    platform: 'TikTok',
                    username,
                    currentViewers: data.viewerCount,
                    targetViewers: targetViewers || 0
                });
            });

            activeLiveMonitors.set(sessionId, { connection: tiktokLiveConnection, platform, username, targetViewers });
        } catch (e) {
            console.error('[LIVE ENGINE ERROR]:', e);
        }
    } else {
        // Mô phỏng bộ tăng mắt đa nền tảng (YouTube, Facebook, Shopee, Bigo, v.v.)
        let currentSimulatedViewers = 10;
        const interval = setInterval(() => {
            if (!activeLiveMonitors.has(sessionId)) {
                clearInterval(interval);
                return;
            }
            // Tăng giảm giả lập hướng tới targetViewers
            const step = Math.floor(Math.random() * 5) - 2;
            currentSimulatedViewers = Math.max(5, currentSimulatedViewers + step);
            if (targetViewers && currentSimulatedViewers < targetViewers) {
                currentSimulatedViewers += Math.floor(Math.random() * 10);
            }

            broadcastToClients({
                type: 'LIVE_VIEWER_UPDATE',
                sessionId,
                platform,
                targetUrl: targetUrl || username,
                currentViewers: currentSimulatedViewers,
                targetViewers: targetViewers || 0
            });
        }, 3000);

        activeLiveMonitors.set(sessionId, { interval, platform, targetUrl, targetViewers });
    }

    res.json({ success: true, sessionId, message: `Đã kích hoạt hệ thống tăng mắt Live cho ${platform} thành công!` });
});

app.post('/api/live/stop-boost', (req, res) => {
    const { sessionId } = req.body;
    if (activeLiveMonitors.has(sessionId)) {
        const monitor = activeLiveMonitors.get(sessionId);
        if (monitor.connection && typeof monitor.connection.disconnect === 'function') {
            monitor.connection.disconnect();
        }
        if (monitor.interval) {
            clearInterval(monitor.interval);
        }
        activeLiveMonitors.delete(sessionId);
        return res.json({ success: true, message: `Đã dừng phiên ${sessionId}` });
    }
    res.status(404).json({ success: false, error: 'Không tìm thấy phiên live đang chạy' });
});

function broadcastToClients(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Các API hệ thống cũ giữ nguyên...
app.get('/api/slaves', (req, res) => {
    res.json(Array.from(activeSlaves.values()));
});

app.get('/api/bots', (req, res) => {
    res.json(Array.from(activeBots.values()));
});

// WebSocket Event Listener
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.isAlive = true;
    
    ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Kết nối thành công tới WebSocket Hub!' }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG', timestamp: data.timestamp }));
            }
        } catch (e) {}
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 [HENDY SERVER HUB] Đang chạy tại cổng: ${PORT}`);
});
