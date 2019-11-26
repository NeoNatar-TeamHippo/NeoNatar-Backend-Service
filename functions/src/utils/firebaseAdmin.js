const config = require('../config/index');
module.exports = {
	type: config.adminConfig.type,
	project_id: config.adminConfig.project_id,
	private_key_id: config.adminConfig.private_key_id,
	private_key: config.adminConfig.private_key.replace(/\\n/g, '\n'),
	client_email: config.adminConfig.client_email,
	client_id: config.adminConfig.client_id,
	auth_uri: config.adminConfig.auth_uri,
	token_uri: config.adminConfig.token_uri,
	auth_provider_x509_cert_url: config.adminConfig.auth_provider_x509_cert_url,
	client_x509_cert_url: config.adminConfig.client_x509_cert_url,
};
