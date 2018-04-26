const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const passport = require('passport')
const db = require('./db')
const cors = require('cors')
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
module.exports = app

let clientUrl;
if (process.env.NODE_ENV === "production") {
    clientUrl = 'https://kingdom.netlify.com'
} else {
    const port = 3000
    clientUrl = `http://localhost:${port}`
}
module.exports = { clientUrl }

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration

const createApp = () => {
  app.use(morgan('dev'))

  app.use(require('cookie-session')({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
    secure: process.env.NODE_ENV !== 'production' ? false : true, //a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS)
    httpOnly: false, //a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
  }))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(passport.initialize())

  app.use(passport.session())

  const corsOptions = {
    origin: clientUrl,
    allowedHeaders: 'X-Requested-With, Content-Type, Accept',
    methods: '*',
    credentials: true
  }
  app.use(cors(corsOptions))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientUrl)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', '*')
    next();
  });

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () => {})
  //const server = http.createServer(app)
  //const stickyServer = sticky.listen(server, PORT)
  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)
}


// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  db.sync()
    .then(createApp)
    .then(startListening)
} else {
  createApp()
}
