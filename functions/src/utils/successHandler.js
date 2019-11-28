class SuccessHandler {
    static successNoData(res, statusCode, message) {
        return res.status(statusCode).json({ message, status: 'success' });
    }
    static successNoMessage(res, statusCode, data) {
        return res.status(statusCode).json({ data, status: 'success' });
    }
    static successWithData(res, statusCode, message, data) {
        return res.status(statusCode).json({
            data, message, status: 'success',
        });
    }
}
module.exports = SuccessHandler;
