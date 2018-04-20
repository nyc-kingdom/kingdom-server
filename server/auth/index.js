const router = require('express').Router()
const { User } = require('../db/models')
const passport = require('passport')
module.exports = router

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) =>
  User.findById(id)
    .then(user => done(null, user))
    .catch(done))

router.post('/logout', (req, res) => {
  console.log("what is req.header: ", req.headers.cookie, req.user, Object.keys(req))
  // req.logout()
  req.session = null

  res.sendStatus(200)
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/foursquare', require('./foursquare'))
