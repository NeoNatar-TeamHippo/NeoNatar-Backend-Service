const locations = require('./locations');
const users = require('./users');
const staffs = require('./staffs');
const commercials = require('./commercials');
const savedLocation = require('./savedLocation');
const campaign = require('./campaign');

const init = app => {
    app.use('/v1/locations', locations);
    app.use('/v1/auth', users);
    app.use('/v1/staffs', staffs);
    app.use('/v1/commercials', commercials);
    app.use('/v1/savedlocation', savedLocation);
    app.use('/v1/campaign', campaign);
};

module.exports = {
    init,
};
