const { firebase, admin } = require('../utils/firebase');
const errorHandler = require('../utils/errorHandler');
const { validateSignInData, validateSignUpData } = require('../validations/user');
const _ = require('lodash');
const db = admin.firestore();
class userController {
    /**
	 * A user sign up route, creates a new dataset in the firestore.
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async signupUser(req, res) {
        try {
            const { email, password, firstName, lastName, confirmPassword } = req.body;
            const dataToValidate = { confirmPassword, email, firstName, lastName, password };
            const { valid, errors } = validateSignUpData(dataToValidate);
            if (!valid) errorHandler.validationError(res, errors);
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const token = await data.user.getIdToken();
            const userCredentials = {
                avatar: '', createdAt: new Date().toISOString(), email,
                firstName, isAdmin: false, lastName, role: '', status: 'active',
                userId: data.user.uid,
            };
            await db.doc(`users/${data.user.uid}`).set(userCredentials);
            return res.status(201).json({
                message: `Sign up successful with id of ${data.user.uid}`, status: 'success', token,
            });
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    }
    /**
	 * A user sign in route, sign in a new user.
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async signinUser(req, res) {
        try {
            const { email, password } = req.body;
            const { valid, errors } = validateSignInData({ email, password });
            if (!valid) errorHandler.validationError(res, errors);
            const data = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (data) {
                const token = await data.user.getIdToken();
                return res.status(201).json({ status: 'success', token });
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                errorHandler.validationError(res, 'Email does not exist');
            }
            if (error.code === 'auth/wrong-password') {
                errorHandler.validationError(res, 'Wrong credentials, please try again');
            }
            errorHandler.tryCatchError(res, error);
        }
    }
}
module.exports = userController;
