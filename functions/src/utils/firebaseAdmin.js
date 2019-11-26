const config = require('../config/index');
module.exports = {
    auth_provider_x509_cert_url: config.adminConfig.auth_provider_x509_cert_url,
    auth_uri: config.adminConfig.auth_uri,
    client_email: config.adminConfig.client_email,
    client_id: config.adminConfig.client_id,
    client_x509_cert_url: config.adminConfig.client_x509_cert_url,
    private_key: config.adminConfig.private_key.replace(/\\n/g, '\n'),
    private_key_id: config.adminConfig.private_key_id,
    project_id: config.adminConfig.project_id,
    token_uri: config.adminConfig.token_uri,
    type: config.adminConfig.type,
};
