exports.handleTelegramWebhook = (req, res, next) => {
    try {
        const update = req.body;
        
        if (!update || (!update.message && !update.callback_query)) {
            const err = new Error('Dữ liệu Webhook Telegram không hợp lệ');
            err.statusCode = 400;
            throw err;
        }

        const message = update.message || update.callback_query.message;
        const text = message.text || '';

        console.log(`[TELEGRAM BOT] Nhận lệnh từ user: ${text}`);

        let responseMessage = 'Đã tiếp nhận yêu cầu xử lý dịch vụ hệ thống của bạn.';
        if (text.startsWith('/boost')) {
            responseMessage = '🚀 Hệ thống đã ghi nhận đơn hàng tăng mắt xem livestream!';
        }

        res.status(200).json({
            success: true,
            method: 'sendMessage',
            chat_id: message.chat.id,
            text: responseMessage
        });
    } catch (error) {
        next(error);
    }
};