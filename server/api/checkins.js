const router = require('express').Router();
const { Checkin } = require('../db/models');
const asyncHandler = require('express-async-handler')
module.exports = router;

router.get('/', asyncHandler(async (req, res, next) => {
  if (req.query.user) {
    const checkins = await Checkin.scope('populated').findAll({
      where: { userId: +req.query.user },
    });
    res.json(checkins);
  }
  if (req.query.establishment) {
    const checkins = await Checkin.findAll({
      where: { establishmentId: +req.query.establishment }
    });
    res.json(checkins);
  }
  else {
    const checkins = await Checkin.findAll({
    });
    res.json(checkins);
  }
}))

router.post('/', asyncHandler(async (req, res, next) => {
    const { userId, establishmentId } = req.body;
    const checkin = await Checkin.scope('populated').create({
      userId: +userId, establishmentId: +establishmentId, lastCheckin: new Date()
    })
    res.json(checkin);
  }
))

router.put('/', asyncHandler(async (req, res, next) => {
    const userId = +req.query.user;
    const establishmentId = +req.query.establishment;
    const checkin = await Checkin.scope('populated').findOne({
      where: { userId: userId, establishmentId: establishmentId },
    });
    const updated = await checkin.update({ lastCheckin: new Date() });
    res.json(updated);
}))
