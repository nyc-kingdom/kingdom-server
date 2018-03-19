const router = require('express').Router();
const { Checkin } = require('../db/models');
module.exports = router;

router.get('/', (req, res, next) => {
  next();
})

router.get('/:userId', async (req, res, next) => {
  try {
    const checkins = await Checkin.findAll({
      where: { userId: +req.params.userId },
      include: [{ all: true, nested: true }]
    });
    res.json(checkins);
  } catch (error) {
    next(error);
  }
})

router.get('/:establishmentId', async (req, res, next) => {
  try {
    const checkins = await Checkin.findAll({
      where: { establishmentId: +req.params.establishmentId },
      include: [{ all: true, nested: true }]
    });
    res.json(checkins);
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { userId, establishmentId } = req.body;
    const checkin = await Checkin.create({ userId: +userId, establishmentId: +establishmentId, lastCheckin: new Date() }, {
      include: [{ all: true, nested: true }]
    })
    res.json(checkin);
  } catch (error) {
    next(error);
  }
})

router.put('/', async (req, res, next) => {
  try {
    const userId = +req.query.user;
    const establishmentId = +req.query.establishment;
    const checkin = await Checkin.findOne({
      where: { userId: userId, establishmentId: establishmentId },
      include: [{ all: true, nested: true }]
    });
    const updated = await checkin.update({lastCheckin: new Date()});
    res.json(updated);
  } catch (error) {
    next(error);
  }
})

