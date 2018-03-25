const router = require('express').Router();
const { Checkin } = require('../db/models');
const asyncHandler = require('express-async-handler')
module.exports = router;

router.get('/', asyncHandler(async (req, res, next) => {
  let checkins
  if (req.query.user) {
    checkins = await Checkin.scope('populated').findAll({
      where: { userId: +req.query.user },
    })
  }
  if (req.query.establishment) {
    checkins = await Checkin.scope('populated').findAll({
      where: { establishmentId: +req.query.establishment }
    })
  }
  if (!req.query.user && !req.query.establishment) {
   checkins = await Checkin.findAll()
  }
  res.send(checkins)
}))
