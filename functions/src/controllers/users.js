const { CREATED, OK } = require('http-status-codes');
const uuidv5 = require('uuid/v5');
const { firebase, admin, db } = require('../utils/firebase');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { validateSignInData, validateSignUpData,
    validateUpdateProfile } = require('../validations/user');
const { getFirebaseLink, createUserData, superAdmin,
    uploadRequest } = require('../utils/functions');
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
            const { valid, errors } = validateSignUpData(req.body);
            if (!valid) return validationError(res, errors);
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const token = await data.user.getIdToken(), userId = data.user.uid;
            const avatar = getFirebaseLink('Headshot-Placeholder-1.png');
            const userData = createUserData(avatar, email, firstName, lastName, userId, false);
            await db.doc(`users/${data.user.uid}`).set(userData);
            return successWithData(res, CREATED, `Sign up successful`, token);
        } catch (error) {
            return tryCatchError(res, error);
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
            if (!valid) return validationError(res, errors);
            const data = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (data) {
                const token = await data.user.getIdToken();
                return successNoMessage(res, CREATED, token);
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                return validationError(res, 'Email does not exist');
            }
            if (error.code === 'auth/wrong-password') {
                return validationError(res, 'Wrong credentials, please try again');
            }
            return tryCatchError(res, error);
        }
    }
    /**
	 * Uploads user avatar to firestore bucket and save url in user credential.
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async uploadAvatar(req, res) {
        try {
            const imageToBeUploaded = req.files[0];
            const { userId } = req.user;
            const token = uuidv5(`${userId}`, uuidv5.URL);
            await uploadRequest(imageToBeUploaded, token);
            const avatar = getFirebaseLink(imageToBeUploaded.originalname, token);
            await db.doc(`/users/${userId}`).update({ avatar });
            return successNoData(res, OK, avatar);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * User profile details
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} user details
	 */
    static async viewProfile(req, res) {
        try {
            const { userId } = req.user;
            const data = await db.collection('users')
                .where('userId', '==', userId).get();
            const userDetails = data.docs[0].data();
            return successNoMessage(res, OK, userDetails);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Update User profile details
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async updateProfile(req, res) {
        try {
            const { userId } = req.user;
            const { address, firstName, lastName } = req.body;
            const { valid, errors } = validateUpdateProfile({ address, firstName, lastName });
            if (!valid) return validationError(res, errors);
            await db.doc(`/users/${userId}`).update({ address, firstName, lastName });
            return successNoData(res, OK, 'Updated successfully');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
  * Logs a user out
  * @function
  * @param {object} req - request object
  * @param {object} res - response object
  * @return  {Object} result
  */
    static async logoutUser(req, res) {
        try {
            const { userId } = req.user;
            await firebase.auth().signOut();
            return successNoData(res, 200, 'Logout successfully');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = userController;
