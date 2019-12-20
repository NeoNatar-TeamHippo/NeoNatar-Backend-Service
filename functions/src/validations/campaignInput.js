const _ = require('lodash');
const { input } = require('../config/constant');
const { category, commercialId, duration, locationsSelected, title } = input;
/**
 * An helper function to sort and compare data in an array
 * @function
 * @param [array] expected data - expected data array
 * @param [array] input data - input data array
 * @return  boolean result
 */
const arrayCompare = (expectedData, inputData) => {
    const stringExpectedData = expectedData.sort();
    const stringInputData = inputData.sort();
    return JSON.stringify(stringExpectedData) === JSON.stringify(stringInputData);
};
/**
 * An helper function to validate campaign input
 * @function
 * @param [array] datas - data to validata
 * @return  {object} result
 */
const validateCampaignInput = datas => {
    const errors = {};
    const expectedData = [ category, 
        commercialId, 
        duration, 
        locationsSelected, 
        title ];
    const key = arrayCompare(expectedData, Object.keys(datas));
    if(!key) {
        errors.fields = `data must be complete`;
    }
    for(const data in datas) {
        if (_.isEmpty(data)) {
            errors.fields = `${data} must not be empty`;
        }
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = validateCampaignInput;
