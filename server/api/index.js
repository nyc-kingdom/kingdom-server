const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'));
router.use('/establishments', require('./establishments'));
router.use('/checkins', require('./checkins'));

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
