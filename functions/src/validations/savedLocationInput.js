const _ = require('lodash');

const arrayCompare = (expectedData, inputData) => {
    const stringExpectedData = expectedData.sort();
    const stringInputData = inputData.sort();
    return JSON.stringify(stringExpectedData) === JSON.stringify(stringInputData);
};
const validateSavedLocationInput = datas => {
    const errors = {};
    const expectedData = ['name', 'price', 'trafficRate', 'address', 'state', 'lga', 'country'];
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
