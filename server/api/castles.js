const router = require('express').Router();
const { Castle } = require('../db/models');
const asyncHandler = require('express-async-handler')
module.exports = router;

router.get('/', asyncHandler( async(req, res, next) => {
  let castles
  if (req.query.kingdom) {
    castles = await Castle.findAll({
      where: { kingdomId: +req.query.kingdom },
    })
  }
  if (req.query.establishment) {
    castles = await Castle.findAll({
      where: { establishmentId: +req.query.establishment }
    })
  }
  if (!req.query.kingdom && !req.query.establishment) {
    castles = await Castle.findAll()
  }
  res.json(castles)
}))
