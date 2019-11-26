class userController {
	/**
	 * Test the routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
	static ping(req, res) {
		return res.status(200).json({
			status: 'success',
			message: 'Successful ping',
		});
	}
}
module.exports = userController;
