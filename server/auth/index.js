const router = require('express').Router()
const User = require('../db/models/user')
const passport = require('passport')
module.exports = router

// router.post('/login', (req, res, next) => {
//   User.findOne({where: {email: req.body.email}})
//     .then(user => {
//       if (!user) {
//         res.status(401).send('User not found')
//       } else if (!user.correctPassword(req.body.password)) {
//         res.status(401).send('Incorrect password')
//       } else {
//         req.login(user, err => (err ? next(err) : res.json(user)))
//       }
//     })
//     .catch(next)
// })

// router.post('/signup', (req, res, next) => {
//   User.create(req.body)
//     .then(user => {
//       req.login(user, err => (err ? next(err) : res.json(user)))
//     })
//     .catch(err => {
//       if (err.name === 'SequelizeUniqueConstraintError') {
//         res.status(401).send('User already exists')
//       } else {
//         next(err)
//       }
//     })
// })

// router.post('/logout', (req, res) => {
//   req.logout()
//   req.session.destroy()
//   res.redirect('/')
// })

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then(user => done(null, user))
    .catch(done))


router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/foursquare', require('./foursquare'))
