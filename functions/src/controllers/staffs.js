const { CREATED, OK } = require('http-status-codes');
const { firebase, db } = require('../utils/firebase');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { validateSignUpData } = require('../validations/user');
const { getFirebaseLink, createUserData } = require('../utils/functions');
class staffController {
    /**
	 * Creates a new staff, only authorized and authenticated as an admin can do this
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async create(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            const { valid, errors } = validateSignUpData(req.body);
            if (!valid) return validationError(res, errors);
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const token = await data.user.getIdToken(), userId = data.user.uid;
            const avatar = getFirebaseLink('Headshot-Placeholder-1.png');
            const userData = createUserData(avatar, email, firstName, lastName, userId, true);
            await db.doc(`users/${userId}`).set(userData);
            return successWithData(res, CREATED, `Staff Sign up successful`, token);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Get all staffs, only authorized and authenticated as an admin can do this
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async allStaffs(req, res) {
        try {
            const data = await db.collection('users')
                .where('isAdmin', '==', true).where('role', '==', 'manager')
                .orderBy('createdAt', 'asc').get();
            const docs = data.docs;
            const staffs = [];
            for (const doc of docs) {
                staffs.push(doc.data());
            }
            return successNoMessage(res, OK, staffs);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Get staffs by id, only authorized and authenticated as an admin can do this
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const data = await db.collection('users')
                .where('userId', '==', id).get();
            const docs = data.docs;
            let staff = {};
            for (const doc of docs) {
                staff = doc.data();
            }
            return successNoMessage(res, OK, staff);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Activate or Deactivate a staff/user,only authorized and authenticated as an admin can do this
     * @query status = active or inactive
     * @query type = user or staff
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async activateOrDeactivateStaff(req, res) {
        try {
            const { id } = req.params;
            const { status, type } = req.query;
            await db.doc(`/users/${id}`).update({ status: status });
            let newStatus, userType;
            if (status === 'active') newStatus = 'activated';
            newStatus = 'deactivated';
            if (type === 'staff') userType = 'Staff';
            userType = 'User';
            return successNoData(res, OK, `${userType} ${newStatus} successfully`);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = staffController;
