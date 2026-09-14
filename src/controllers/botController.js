const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../database.json');

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {}
    return {};
}

function saveDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4), 'utf8');
    } catch (e) {}
}

// Xử lý Webhook từ Telegram (nếu cấu hình Webhook mode)
const handleTelegramWebhook = (req, res, next) => {
    try {
        const update = req.body;
        // Logic xử lý update từ Telegram Webhook ở đây
        res.status(200).json({ success: true, message: 'Webhook received successfully' });
    } catch (error) {
        next(error);
    }
};

// Xử lý đặt đơn dịch vụ mạng xã hội (SMM) qua API / Dashboard
const processSMMOrder = (req, res, next) => {
    try {
        const { userId, serviceName, link, quantity, price } = req.body;
        let users = loadDB();

        if (!users[userId]) {
            users[userId] = { name: 'Web User', balance: 50000, orders: [] };
        }

        const totalCost = quantity * price;
        if (users[userId].balance < totalCost) {
            const err = new Error('Số dư ví không đủ để thực hiện giao dịch!');
            err.statusCode = 400;
            throw err;
        }

        users[userId].balance -= totalCost;
        const newOrder = {
            id: 'ORD' + Math.floor(Math.random() * 90000 + 10000),
            serviceName,
            link,
            quantity,
            totalCost,
            status: '✅ Đã hoàn thành',
            date: new Date().toLocaleString('vi-VN')
        };

        if (!users[userId].orders) users[userId].orders = [];
        users[userId].orders.push(newOrder);
        saveDB(users);

        res.status(200).json({
            success: true,
            message: 'Đặt đơn hàng mạng xã hội thành công!',
            order: newOrder,
            remainingBalance: users[userId].balance
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleTelegramWebhook, processSMMOrder };
