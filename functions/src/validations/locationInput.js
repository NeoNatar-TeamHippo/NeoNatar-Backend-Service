const _ = require('lodash');

const validateLocationInput = datas => {
    const errors = {};
    if(Object.keys(datas).length !== 10) {
        errors.fields = `data must be complete`;
    }
    for(const data in datas) {
        if (_.isEmpty(data)) {
            errors.fields = `${data} must not be empty`;
        }
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = validateLocationInput;
