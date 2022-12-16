const passport = require('../config/passport')  

const authenticated = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
		req.user = user
		next()
	})(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err || !user || user.role !== 'admin') return res.status(401).json({ status: 'error', message: 'permission denied' })
		req.user = user
		next()
	})(req, res, next)

}

module.exports = {
	authenticated,
	authenticatedAdmin
}
