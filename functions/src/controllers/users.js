const { firebase, admin } = require('../utils/firebase');
const errorHandler = require('../utils/errorHandler');
const { validateSignInData, validateSignUpData } = require('../validations/user');
const { firebaseConfig } = require('../config/index');
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
            const defaultAvatar = 'Headshot-Placeholder-1.png';
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const token = await data.user.getIdToken();
            const userCredentials = {
                avatar: `https://firebaseestorage.googleapis.com/v0/b/
                ${firebaseConfig.storageBucket}/o/${defaultAvatar}?alt=media`,
                createdAt: new Date().toISOString(), email,
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
            const avatar = `https://firebaseestorage.googleapis.com/v0/b/
            ${firebaseConfig.storageBucket}/o/
            ${imageToBeUploaded.originalname}?alt=media`;
            await db.doc(`/users/${userId}`).update({ avatar });
            return res.status(200).json({ message: 'Avatar uploaded success', status: 'success' });
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    }
}
module.exports = userController;
