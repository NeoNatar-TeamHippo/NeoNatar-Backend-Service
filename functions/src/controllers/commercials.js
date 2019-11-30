const { CREATED, OK } = require('http-status-codes');
const { firebase, db } = require('../utils/firebase');
const cloud = require('../utils/cloudinaryConfig');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
// const { } = require('../utils/functions');
const { validateDetails } = require('../validations/commercial');
class commercialController {
    /**
	 * Creates uploads a new video commercial
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    // eslint-disable-next-line max-lines-per-function
    static async create(req, res) {
        try {
            const { title, description } = req.body;
            const { userId } = req.user;
            // console.log(req.user);
            console.log(req.files, title, description);
            const { valid, errors } = validateDetails(req.body);
            if (!valid) return validationError(res, errors);
            // const rslt = await cloud(req.files[0].path);
            // FIXME: add videolink to the create commercial.
            const newCommercial = {
                createdAt: new Date().toISOString(),
                createdBy: userId, description, title,
            };
            console.log(newCommercial);
            // await db.collection('commercials').add(newCommercial);
            //doc.id nd doc.data().createdAt
            return successNoData(res, CREATED, `Commercial created successful`);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = commercialController;
