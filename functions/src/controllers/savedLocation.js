const {
    CREATED, OK,
} = require('http-status-codes');

const { db, fieldValue } = require('../utils/firebase');
const validateSavedLocationInput = require('../validations/savedLocationInput');
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoData, successNoMessage, successWithData } = require('../utils/successHandler');

const SavedLocations = {
    /**
	 * The Location Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
    */
    async addLocations(req, res) {
        try {
            const { id } = req.params, { type } = req.query, { locations } = req.body;
            if (type === 'add' || type === 'remove') {
                const operationType = locationId => type === 'add' ?
                    fieldValue.arrayUnion(locationId) : fieldValue.arrayRemove(locationId);
                const docRef = db.collection('savedLocations').doc(id);
                const locationOperation = locations.map(id => docRef.update({
                    locations: operationType(id),
                    updatedAt: new Date().toISOString(), updatedBy: req.user.uid,
                }));
                await Promise.all(locationOperation);
                return successNoData(res, OK, 'Updated successfully');
            }
            return validationError(res, 'Pass in a query parameter');

        } catch (error) {
            tryCatchError(res, error);
        }
    },
    async create(req, res) {
        try {
            const { valid, errors } = await validateSavedLocationInput(req.body);
            if (!valid) validationError(res, errors);
            req.body.createdAt = new Date().toISOString();
            req.body.createdBy = req.user.uid;
            if (valid) {
                const doc = await db.collection('savedLocations').add(req.body);
                const docData = await db.collection('savedLocations').doc(doc.id).get();
                const data = Object.assign({}, docData.data(), { savedLocationId: doc.id });
                return successNoMessage(res, CREATED, data);
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
    // eslint-disable-next-line max-lines-per-function
    async getOne(req, res) {
        try {
            const documentData = await db.collection('savedLocations').doc(req.params.id).get();
            const savedLocations = documentData.data();
            savedLocations.savedLocationId = documentData.id;
            if (savedLocations.createdBy !== req.user.uid) {
                return validationError(res, 'Not Authorized to view this');
            }
            const { locations } = savedLocations;
            if (locations.length !== 0) {
                const retrievedLocations = locations.map(id => db.
                    collection('locations').doc(id).get());
                const newLocations = await Promise.all(retrievedLocations);
                savedLocations.locations = newLocations.map(doc => Object.assign({},
                    doc.data(), { locationId: doc.id }));
            }
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
