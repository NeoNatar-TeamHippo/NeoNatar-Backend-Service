const {
    CREATED, OK,
} = require('http-status-codes');
const uuidv5 = require('uuid/v5');

const { db } = require('../utils/firebase');
const { getMultipleFirebaseLink, uploadMultipleImages } = require('../utils/functions');
const validateLocationInput = require('../validations/locationInput');
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoData, successNoMessage } = require('../utils/successHandler');

const Locations = {
    /**
	 * The Location Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	*/
    async create(req, res) {
        try {
            const { valid, errors } = await validateLocationInput(req.body);
            if (!valid) return validationError(res, errors);
            const { userId } = req.user;
            const token = uuidv5(`${userId}`, uuidv5.URL);
            req.body.createdAt = new Date().toISOString();
            req.body.createdBy = req.user.uid;
            await uploadMultipleImages(req.files, token);
            req.body.images = await getMultipleFirebaseLink(req.files, token);
            const doc = await db.collection('locations').add(req.body);
            const docData = await db.collection('locations').doc(doc.id).get();
            const data = Object.assign({}, docData.data(), { locationId: doc.id });
            return successNoMessage(res, CREATED, data);
        } catch (error) {
            console.log(error);
            return tryCatchError(res, error);
        }
    },

    async deleteLocation(req, res) {
        try {
            const location = await db.collection('locations').doc(req.params.id);
            await location.delete();
            if (!location) {
                return validationError(res, 'Location not found');
            }
            return successNoData(res, OK, 'Location deleted successfully');
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async getAll(req, res) {
        try {
            const locations = [];
            const data = await db.collection('locations').get();
            const docs = data.docs;
            for (const doc of docs) {
                const newObj = Object.assign({}, doc.data(), { locationId: doc.id });
                locations.push(newObj);
            }
            return successNoMessage(res, OK, locations);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async getOne(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);
            if (!document) {
                return validationError(res, 'Document not found');
            }
            const documentData = await document.get();
            const location = documentData.data();
            return successNoMessage(res, OK, location);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async updateLocation(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);
            if (!document) validationError(res, errors);
            const { valid, errors } = await validateLocationInput(req.body);
            if (!valid) validationError(res, errors);
            const { userId } = req.user;
            const token = uuidv5(`${userId}`, uuidv5.URL);
            await uploadMultipleImages(req.files, token);
            req.body.images = await getMultipleFirebaseLink(req.files, token);
            req.body.updatedAt = new Date().toISOString();
            req.body.updatedBy = req.user.uid;
            if (valid) {
                await document.update(req.body);
                return successNoData(res, OK, 'Location successfully updated');
            }
        } catch (error) {
            tryCatchError(res, error);
        }
    },
};

module.exports = Locations;
