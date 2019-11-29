const locations = require('./locations');
const users = require('./users');
const staffs = require('./staffs');

const init = app => {
    app.use('/v1/locations', locations);
    app.use('/v1/auth', users);
    app.use('/v1/staffs', staffs);
};

module.exports = {
    init,
};
