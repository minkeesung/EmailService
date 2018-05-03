const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

// automatically called w/ user model, will stuff token into user's cookie.
// user.id is not profile.id. Do this b/c can have multiple strategies like fb, linkedin...
// id is shortcut to _id.$oid
// OAuth's only purpose is to allow someone to sign in.  After that, we use our own internal ID's
passport.serializeUser((user, done) => {
	done(null, user.id) // first argument is error object.  second argument is user record
})

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user)
	})
})

// clientID is a public token, identify our application to google servers
// clientsecret is secure piece of information, if someone has access they have more access to code?

passport.use(
	// passport is informed to use google strategy
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback', // route user is sent to after user grants permission, relatvive path
			proxy: true // tells google strategy to trust heroku proxy, https vs http
		},
		//
		async (accessToken, refreshToken, profile, done) => {
			const existingUser = await User.findOne({ googleId: profile.id })

			if (existingUser) {
				return done(null, existingUser)
			}
			const user = await new User({ googleId: profile.id }).save()
			done(null, user)
		}
	)
)
