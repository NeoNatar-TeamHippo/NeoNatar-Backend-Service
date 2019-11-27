const { firebase, admin } = require('../utils/firebase');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { validateSignInData, validateSignUpData,
    validateUpdateProfile } = require('../validations/user');
const { getFirebaseLink, createUserData } = require('../utils/functions');
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
            if (!valid) validationError(res, errors);
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const token = await data.user.getIdToken();
            const userId = data.user.uid;
            const avatar = getFirebaseLink('Headshot-Placeholder-1.png');
            const userData = createUserData(avatar, email, firstName, lastName, userId);
            await db.doc(`users/${data.user.uid}`).set(userData);
            successWithData(res, 201, `Sign up successful`, token);
        } catch (error) {
            tryCatchError(res, error);
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
            if (!valid) validationError(res, errors);
            const data = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (data) {
                const token = await data.user.getIdToken();
                successNoMessage(res, 201, token);
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                validationError(res, 'Email does not exist');
            }
            if (error.code === 'auth/wrong-password') {
                validationError(res, 'Wrong credentials, please try again');
            }
            tryCatchError(res, error);
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
            await admin.storage().bucket().upload(imageToBeUploaded.filepath, {
                metadata: { metadata: { contentType: imageToBeUploaded.mimetype } },
                resumable: false,
            });
            const avatar = getFirebaseLink(imageToBeUploaded.originalname);
            await db.doc(`/users/${userId}`).update({ avatar });
            successNoData(res, 200, 'Avatar uploaded success');
        } catch (error) {
            tryCatchError(res, error);
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
            successNoMessage(res, 200, userDetails);
        } catch (error) {
            tryCatchError(res, error);
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
            const valid = validateUpdateProfile(req.body);
            if (!valid) validationError(res, errors);
            await db.doc(`/users/${userId}`).update({ address, firstName, lastName });
            successNoData(res, 200, 'Updated successfully');
        } catch (error) {
            tryCatchError(res, error);
        }
    }
}
module.exports = userController;
