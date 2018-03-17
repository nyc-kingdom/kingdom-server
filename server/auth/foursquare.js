const passport = require('passport')
const router = require('express').Router()
const FoursquareStrategy = require('passport-foursquare').Strategy;
const { User } = require('../db/models')
module.exports = router

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */

if (!process.env.FOURSQUARE_ID || !process.env.FOURSQUARE_CLIENT_SECRET) {

  console.log('foursquare client ID / secret not found. Skipping foursquare OAuth.')

} else {

  const foursquareConfig = {
    clientID: process.env.FOURSQUARE_ID,
    clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
    callbackURL: process.env.FOURSQUARE_CALLBACK
  }

  const strategy = new FoursquareStrategy(foursquareConfig, (token, refreshToken, profile, done) => {
    const foursquareId = profile.id
    const name = profile.displayName
    const email = profile.emails[0].value

    User.find({ where: { foursquareId } })
      .then(foundUser => (foundUser
        ? done(null, foundUser)
        : User.create({ name, email, foursquareId })
          .then(createdUser => done(null, createdUser))
      ))
      .catch(done)
  })

  passport.use(strategy)

  router.get('/', passport.authenticate('foursquare', { scope: 'email' }))

  router.get('/callback', passport.authenticate('foursquare', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000'
  }))
}
