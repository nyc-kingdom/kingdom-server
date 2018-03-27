const passport = require('passport')
const router = require('express').Router()
const FoursquareStrategy = require('passport-foursquare').Strategy;
const { User } = require('../db/models')
const deployedUrl = 'https://condescending-panini-ddd503.netlify.com'
const devUrl = 'http://localhost:3000'
module.exports = router

if (!process.env.FOURSQUARE_ID || !process.env.FOURSQUARE_CLIENT_SECRET) {

  console.log('foursquare client ID / secret not found. Skipping foursquare OAuth.')

} else {

  const foursquareConfig = {
    clientID: process.env.FOURSQUARE_ID,
    clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
    callbackURL: process.env.FOURSQUARE_CALLBACK
  }

  if (process.env.NODE_ENV !== 'production') foursquareConfig.callbackURL = process.env.FOURSQUARE_CALLBACK_DEV

  const strategy = new FoursquareStrategy(foursquareConfig, (token, refreshToken, profile, done) => {
    const foursquareId = profile.id
    const name = profile.displayName
    const email = profile.emails[0].value

    User.find({ where: { foursquareId } })
      .then(foundUser => (foundUser
        ? done(null, foundUser)
        : User.create({ name, email, foursquareId, token })
          .then(createdUser => done(null, createdUser))
      ))
      .catch(done)
  })

  passport.use(strategy)

  router.get('/', passport.authenticate('foursquare', { scope: 'email' }))

  if (process.env.NODE_ENV !== 'production') {
    router.get('/callback', passport.authenticate('foursquare', {
      successRedirect: `${devUrl}/dashboard`,
      failureRedirect: `${devUrl}/`
    }))
  } else {
    router.get('/callback', passport.authenticate('foursquare', {
      successRedirect: `${deployedUrl}/dashboard`,
      failureRedirect: `${deployedUrl}/`
    }))
  }
}
