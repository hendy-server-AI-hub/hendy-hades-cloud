module.exports = (err, req, res, next) => {
    console.error('❌ [Error Middleware]:', err.stack || err);
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: err.message || 'Lỗi Internal Server Error từ hệ thống'
        }
    });
};
