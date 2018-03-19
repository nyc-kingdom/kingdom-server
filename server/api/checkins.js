const router = require('express').Router();
const { Checkin } = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    if (req.query.user) {
      const checkins = await Checkin.findAll({
        where: { userId: +req.query.user },
        include: [{ all: true, nested: true }]
      });
      res.json(checkins);
    }
    if (req.query.establishment) {
      const checkins = await Checkin.findAll({
        where: { establishmentId: +req.query.establishment },
        include: [{ all: true, nested: true }]
      });
      res.json(checkins);
    }
    else {
      const checkins = await Checkin.findAll({
        include: [{ all: true, nested: true }]
      });
      res.json(checkins);
    }
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
    const updated = await checkin.update({ lastCheckin: new Date() });
    res.json(updated);
  } catch (error) {
    next(error);
  }
})

