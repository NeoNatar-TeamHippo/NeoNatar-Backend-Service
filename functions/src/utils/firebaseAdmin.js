const { adminConfig } = require('../config/index');
const { auth_provider_x509_cert_url, auth_uri, client_email, client_id,
    client_x509_cert_url, private_key, private_key_id, project_id, token_uri, type } = adminConfig;
module.exports = {
    auth_provider_x509_cert_url,
    auth_uri,
    client_email,
    client_id,
    client_x509_cert_url,
    private_key: private_key.replace(/\\n/g, '\n'),
    private_key_id,
    project_id,
    token_uri,
    type,
};
