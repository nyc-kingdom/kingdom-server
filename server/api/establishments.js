const router = require('express').Router()
const { Establishment, Checkin, Castle } = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router

router.get('/', asyncHandler(async (req, res, next) => {
  const establishments = await Establishment.scope('populated').findAll();
  res.json(establishments);
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const { name, address, longitude, latitude, userId, kingdomId } = req.body;
  const establishment = await Establishment.scope('populated').create({
    name, address, longitude, latitude
  })
  const establishmentId = establishment.id
  await Checkin.create({ userId, establishmentId })
  await Castle.create({ kingdomId, establishmentId })
  res.json(establishment);
}
))
