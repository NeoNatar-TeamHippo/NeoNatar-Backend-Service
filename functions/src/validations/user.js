const isEmail = email => {
	var re = /\S+@\S+\.\S+/;
	return re.test(String(email).toLowerCase());
};
module.exports = {
	isEmail,
};
