const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/establishments', require('./establishments'))
router.use('/checkins', require('./checkins'))
router.use('/kingdoms', require('./kingdoms'))
router.use('/castles', require('./castles'))
router.use('/markers', require('./markers'))
router.use('/leaderboard', require('./leaderboard'))
router.use('/shields', require('./shields'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
