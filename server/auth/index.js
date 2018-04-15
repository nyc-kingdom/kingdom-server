const router = require('express').Router()
const User = require('../db/models/user')
const passport = require('passport')
module.exports = router

console.log("which enviroment", process.env)

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) =>
  User.findById(id)
    .then(user => done(null, user))
    .catch(done))

router.post('/logout', (req, res) => {
  req.logout()
  console.log("What is req.session: ", req.session)
  res.sendStatus(200)
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/foursquare', require('./foursquare'))
