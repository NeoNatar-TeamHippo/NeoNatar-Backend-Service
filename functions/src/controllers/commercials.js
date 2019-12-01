const { CREATED, OK } = require('http-status-codes');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { firebase, db } = require('../utils/firebase');
const { uploads } = require('../utils/cloudinaryConfig');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { updateVideo } = require('../utils/functions');
const { validateDetails } = require('../validations/commercial');
class commercialController {
    /**
	 * Creates uploads a new video commercial
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    // TODO: check for mimetype if video b4 proceeding to uploading to cloudinary
    static async create(req, res) {
        try {
            const { title, description } = req.body;
            const { userId } = req.user, filePath = req.files[0].filepath;
            if (!req.files) return validationError(res, 'No video uploaded');
            const { valid, errors } = validateDetails({ description, title });
            if (!valid) return validationError(res, errors);
            const duration = await getVideoDurationInSeconds(filePath);
            const { url, id } = await uploads(filePath);
            const newCommercial = {
                createdAt: new Date().toISOString(),
                createdBy: userId, description, duration: Math.round(duration), title,
                url, videoId: id,
            };
            const doc = await db.collection('commercials').add(newCommercial);
            return successNoData(res, CREATED, `Commercial with id ${doc.id} was created`);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Gets all videos commercials created by that user
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async getAll(req, res) {
        try {
            const { userId } = req.user;
            const data = await db.collection('commercials').where('createdBy', '==', userId)
                .orderBy('createdAt', 'desc').get();
            const docs = data.docs;
            const commercials = [];
            for (const doc of docs) {
                const obj = {
                    commercial: doc.data(),
                    id: doc.id,
                };
                commercials.push(obj);
            }
            return successNoMessage(res, OK, commercials);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
	 * Get details of commercial
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const { userId } = req.user;
            const doc = await db.collection('commercials').doc(id).get();
            if (!doc) {
                return validationError(res, 'Document not found');
            }
            const obj = {
                commercial: doc.data(),
                id: doc.id,
            };
            return successNoMessage(res, OK, obj);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Update details of commercial
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { description, title } = req.body;
            const { valid, errors } = validateDetails({ description, title });
            if (!valid) return validationError(res, errors);
            const docs = await db.collection('commercials').doc(id);
            if (!docs) return validationError(res, 'Document not found');
            const result = await docs.get();
            const { videoId } = await result.data();
            const updatedObj = await updateVideo(videoId, req.files[0].filepath,
                { description, title });
            await docs.update(updatedObj);
            return successNoData(res, OK, 'Commercial successfully updated');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Delete commercial
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const docs = await db.collection('commercials').doc(id);
            await docs.delete();
            if (!docs) {
                return validationError(res, 'Commercial not found');
            }
            return successNoData(res, OK, 'Commercial deleted successfully');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = commercialController;
