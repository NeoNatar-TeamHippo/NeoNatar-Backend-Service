class ErrorHandler {
	static validationError(res, message) {
		return res.status(400).json({ status: 'error', message });
	}

	static tryCatchError(res, error) {
		console.error(error);
		return res.status(error.code).json({
			status: 'error',
			message: error.message,
		});
	}
}
module.exports = ErrorHandler;
