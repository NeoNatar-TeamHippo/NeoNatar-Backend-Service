const { admin } = require('../utils/firebase');
const FBauth = async (req, res, next) => {
	try {
		let idToken;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer ')
		) {
			idToken = req.headers.authorization.split('Bearer ')[1];
		} else {
			console.error('No token found');
			return res.status(403).json({ status: 'error', message: 'Unauthorized' });
		}
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedToken;
		const data = await admin
			.firestore()
			.collection('users')
			.where('userId', '==', req.user.uid)
			.limit()
			.get();
		const { userId, role, isAdmin, status } = data.docs[0].data();
		req.user.userId = userId;
		req.user.role = role;
		req.user.isAdmin = isAdmin;
		req.user.status = status;
		return next();
	} catch (error) {
		console.error(error, 'Error verifying token');
		return res.status(403).json({ status: 'error', message: error.message });
	}
};
module.exports = {
	FBauth,
};
