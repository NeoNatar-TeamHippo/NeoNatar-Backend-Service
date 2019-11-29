const _ = require('lodash');

const validateLocationInput = datas => {
    const errors = {};
    for(const data in datas) {
        if(datas.length !== 10) {
            errors.fields = `data must not be complete`;
        }
        if (_.isEmpty(data)) {
            errors.fields = `${data} must not be empty`;
        }
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = validateLocationInput;
