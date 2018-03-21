const router = require('express').Router()
const {Establishment, Checkin} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const establishments = await Establishment.scope('populated').findAll();
    console.log(establishments[0].keeper)
    res.json(establishments);
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  console.log('anyone home')
  try {
    const { name, address, longitude, latitude, userId } = req.body;
    const establishment = await Establishment.create({ name, address, longitude, latitude }, {
      include: [{ all: true, nested: true }]
    })
    const establishmentId = establishment.id
    await Checkin.create({ userId: +userId, establishmentId }, {
      include: [{ all: true, nested: true }]
    })
    res.json(establishment);
  } catch (error) {
    next(error);
  }
});
