const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    console.error(`[ERROR] Status: ${statusCode} - Message: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: err.message || 'Lỗi hệ thống nội bộ (Internal Server Error)',
            timestamp: new Date().toISOString()
        }
    });
};

module.exports = errorHandler;