const {
    CREATED, OK,
} = require('http-status-codes');

const { db } = require('../utils/firebase');
const validateSavedLocationInput = require('../validations/savedLocationInput');
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoData, successNoMessage } = require('../utils/successHandler');

const SavedLocations = {
    /**
	 * The Location Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	*/
    async create(req, res) {
        try {
            const { valid, errors } = await validateSavedLocationInput(req.body);
            if (!valid) validationError(res, errors);
            req.body.createdAt = new Date().toISOString();
            req.body.createdBy = req.user.uid;
            if (valid) {
                await db.collection('savedLocations').doc().create(req.body);
                return successNoData(res, CREATED, 'Saved Locations successfully created');
            }
        } catch (error) {
            return tryCatchError(res, error);
        }
    },

    async deleteSavedLocation(req, res) {
        try {
            const savedLocation = await db.collection('savedLocations').doc(req.params.id);
            await savedLocation.delete();
            if (!savedLocation) {
                return validationError(res, 'Saved Location not found');
            }
            return successNoData(res, OK, 'Saved Location deleted successfully');
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async getAll(req, res) {
        try {
            const { uid } = req.user;
            const data = await db.collection('savedLocations').where('createdBy', '==', uid)
                .orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const savedLocations = docs.
                map(doc => Object.assign({}, doc.data(), { savedLocationId: doc.id }));
            return successNoMessage(res, OK, savedLocations);
        } catch (error) {
            tryCatchError(res, error);
        }
    },
    async getOne(req, res) {
        try {
            const documentData = await db.collection('savedLocations').doc(req.params.id).get();
            const savedLocations = documentData.data();
            const { locations } = savedLocations;
            if (savedLocations.createdBy !== req.user.uid) {
                return validationError(res, 'Not Authorized to view this');
            }
            const retrievedLocations = locations.map(id => db.
                collection('locations').doc(id).get());
            const newLocations = await Promise.all(retrievedLocations);
            savedLocations.locations = newLocations.map(doc => Object.assign({},
                doc.data(),
                { savedLocationId: doc.id }));
            return successNoMessage(res, OK, savedLocations);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async updateSavedLocation(req, res) {
        try {
            const document = db.collection('savedLocations').doc(req.params.id);
            if (!document) validationError(res, errors);
            const { valid, errors } = await validateSavedLocationInput(req.body.location);
            if (!valid) validationError(res, errors);
            req.body.updatedAt = new Date().toISOString();
            req.body.updatedBy = req.user.uid;
            await document.update(req.body);
            return successNoData(res, CREATED, 'saved Location successfully updated');
        } catch (error) {
            tryCatchError(res, error);
        }
    },
};

module.exports = SavedLocations;
