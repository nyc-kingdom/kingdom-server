const router = require('express').Router()
const User = require('../db/models/user')
const passport = require('passport')
module.exports = router

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then(user => done(null, user))
    .catch(done))

router.post('/logout', (req, res) => {
  console.log("I am auth router", req.session)
  req.logout()
  res.sendStatus(200)
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/foursquare', require('./foursquare'))
