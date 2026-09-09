const express = require('express');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến API chính
app.use('/api', apiRoutes);

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 [ECOSYSTEM API] Server đang chạy tại cổng: ${PORT}`);
});

module.exports = app;