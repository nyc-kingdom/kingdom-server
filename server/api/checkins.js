const router = require('express').Router();
const { Checkin, Establishment, User } = require('../db/models');
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
    checkins = await Checkin.scope('populated').findAll()
  }
  res.json(checkins)
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const { userId, establishmentId } = req.body;
  const checkin = await Checkin.scope('populated').create({
    userId: +userId, establishmentId: +establishmentId, lastCheckin: new Date()
  })
  await updateKeeper(+establishmentId)
  res.json(checkin);
}
))

router.put('/', asyncHandler(async (req, res, next) => {
  const userId = +req.query.user;
  const establishmentId = +req.query.establishment;
  const checkin = await Checkin.scope('populated').findOrCreate({
    where: { userId, establishmentId },
    defaults: { lastCheckin: new Date() }
  });
  const updated = checkin[1] ? checkin[0] : await checkin[0].update({ lastCheckin: new Date() })
  await updateKeeper(establishmentId)
  res.json(updated);
}))

// router.put('/foursquare', asyncHandler(async (req, res, next) => {

// }))

async function updateKeeper(establishmentId) {
  const establishment = await Establishment.scope('populated').findById(establishmentId)
  const keeper = await User.scope('populated').findById(establishment.keeper)
  await keeper.update({isEdited: true})
}
