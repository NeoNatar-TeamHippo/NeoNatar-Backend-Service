const _ = require('lodash');
const { savedLocationInput } = require('../config/index');
const { name, price, trafficRate, address, state, lga, country } = savedLocationInput;
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
 * An helper function to validate saved Location input
 * @function
 * @param [array] datas - dta to validata
 * @return  {object} result
 */
const validateSavedLocationInput = datas => {
    const errors = {};
    const expectedData = [ name, price, trafficRate, address, state, lga, country ];
    datas.forEach(savedLocation => {
        const key = arrayCompare(expectedData, Object.keys(savedLocation));
        if(!key) {
            errors.fields = `data must be complete`;
        }
        for(const data in savedLocation) {
            if (_.isEmpty(data)) {
                errors.fields = `${data} must not be empty`;
            }
        }
    });
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = validateSavedLocationInput;
