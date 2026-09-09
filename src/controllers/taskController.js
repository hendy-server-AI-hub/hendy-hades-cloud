exports.getTasks = (req, res, next) => {
    try {
        const tasks = [
            { id: 1, title: 'Tối ưu hóa hệ thống API', status: 'completed' },
            { id: 2, title: 'Đồng bộ hóa Telegram Webhook', status: 'pending' }
        ];
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

exports.createTask = (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            const err = new Error('Tiêu đề task không được để trống!');
            err.statusCode = 400;
            throw err;
        }

        const newTask = { id: Date.now(), title, status: 'pending' };
        res.status(201).json({ success: true, message: 'Tạo task thành công', data: newTask });
    } catch (error) {
        next(error);
    }
};