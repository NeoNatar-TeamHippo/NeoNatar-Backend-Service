const { firebase, admin } = require('../utils/firebase');
const errorHandler = require('../utils/errorHandler');
const { isEmail } = require('../validations/user');
const _ = require('lodash');
const db = admin.firestore();
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
	/**
	 * A user sign up route, creates a new dataset in the firestore.
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
	static async signupUser(req, res) {
		try {
			const {
				email,
				password,
				firstName,
				lastName,
				confirmPassword,
			} = req.body;
			let errors = {};
			if (
				_.isEmpty(email) ||
				_.isEmpty(password) ||
				_.isEmpty(firstName) ||
				_.isEmpty(lastName)
			) {
				errors.fields = 'Fields must not be empty';
			}
			if (!isEmail(email)) {
				errors.email = 'Must be a valid email';
			}
			if (!_.isEqual(password, confirmPassword)) {
				errors.password = 'Password does not match';
			}
			if (Object.keys(errors).length > 0)
				return res.status(400).json({ status: 'error', errors });
			const data = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password);
			if (data) {
				const token = await data.user.getIdToken();
				const userCredentials = {
					userId: data.user.uid,
					email,
					firstName,
					lastName,
					status: 'active',
					isAdmin: false,
					role: '',
					avatar: '',
					createdAt: new Date().toISOString(),
				};
				await db.doc(`users/${data.user.uid}`).set(userCredentials);
				return res.status(201).json({
					status: 'success',
					message: `Sign up successful with id of ${data.user.uid}`,
					token,
				});
			}
		} catch (error) {
			errorHandler.tryCatchError(res, error);
		}
	}
}
module.exports = userController;
