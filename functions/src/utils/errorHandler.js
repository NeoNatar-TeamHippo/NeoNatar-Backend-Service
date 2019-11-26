class ErrorHandler {
	static validationError(res, message) {
		return res.status(400).json({ status: 'error', message });
	}

	static tryCatchError(res, error) {
		return res.status(500).json({
			status: 'error',
			message: error.message,
		});
	}
}
module.exports = ErrorHandler;
