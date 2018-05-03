const passport = require('passport')

module.exports = app => {
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			// uses google strategy, GoogleStrategy has a string 'google', that knows to be run when called as argument
			scope: ['profile', 'email'] // specifies to google server what access it wants from the google server
		})
	)

	app.get(
		'/auth/google/callback', // this time around url has code, so passport knows that we are trying to create user profile
		passport.authenticate('google'), // runs callback function from google, google knows not to ask user permission again, b/c the url has code
		(req, res) => {
			res.redirect('/surveys')
		}
	)

	app.get('/api/logout', (req, res) => {
		req.logout() // function attached to req by passport.  kills the cookie
		res.redirect('/')
	})

	app.get('/api/current_user', (req, res) => {
		res.send(req.user)
	})
}
