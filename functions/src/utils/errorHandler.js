class ErrorHandler {
    static validationError(res, message) {
        return res.status(400).json({ message, status: 'error' });
    }
    static tryCatchError(res, error) {
        console.error(error);
        return res.status(error.code).json({
            message: error.message,
            status: 'error',
        });
    }
}
module.exports = ErrorHandler;
