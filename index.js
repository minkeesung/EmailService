const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./models/User') // have to have this line before services/passport because otherwise passport won't know about the User class
require('./models/Survey')
require('./services/passport') // have to run in one file b/c otherwise passport code in servies will not run
// since you are not exporting anything from services passport can just require, just running the code in that file
// services passport doesn't return anything
mongoose.connect(keys.mongoURI)

const app = express()

app.use(bodyParser.json())
app.use(
	// video 42.
	cookieSession({
		// extracts cookie data, then data is passed to passport
		maxAge: 30 * 24 * 60 * 60 * 1000, // how long cookie can exist before it automatically expires, milliseconds
		keys: [keys.cookieKey] // cookie is encrypted, so malicous users can't change user id
	})
)

app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/surveyRoutes')(app)

if (process.env.NODE_ENV === 'production') {
	// express will serve up production assets
	// like our main.js file, or main.css file
	app.use(express.static('client/build'))

	// Express will serve up the index.html file if it doesn't recognize the route
	const path = require('path')
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT || 5000

// env environment variables
app.listen(PORT)
