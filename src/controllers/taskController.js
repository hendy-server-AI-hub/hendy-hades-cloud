// Lấy danh sách task hoặc trạng thái hệ thống
const getTasks = (req, res, next) => {
    try {
        const tasks = [
            { id: 1, title: 'Network Latency Monitor', status: 'Active', ping: '12ms' },
            { id: 2, title: 'Bot Account Management', status: 'Running', count: 1 }
        ];
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

// Tạo task mới
const createTask = (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            const err = new Error('Thiếu tiêu đề task bắt buộc!');
            err.statusCode = 400;
            throw err;
        }
        res.status(201).json({ 
            success: true, 
            message: 'Đã tạo task thành công', 
            data: { title, description, createdAt: new Date() } 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, createTask };
