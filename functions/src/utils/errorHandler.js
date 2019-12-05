const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = require('http-status-codes');
class ErrorHandler {
    static validationError(res, message) {
        return res.status(BAD_REQUEST).json({ message, status: 'error' });
    }
    static normalError(res, statusCode, message) {
        return res.status(statusCode).json({ message, status: 'error' });
    }
    static tryCatchError(res, error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: 'error',
        });
    }
}
module.exports = ErrorHandler;
