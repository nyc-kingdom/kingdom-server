const router = require('express').Router();
const { Checkin, Castle } = require('../db/models');
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
   checkins = await Checkin.scope('populated').findAll({ order: [ ['updatedAt', 'ASC'] ] })
  }
  res.send(checkins)
}))

router.delete('/:userId/:kingdomId', asyncHandler(async (req, res, next) => {
  const userId = req.params.userId
  const kingdomId = req.params.kingdomId
  const userCheckins = await Checkin.findAll({ where: { userId }})
  const condenseCheckins = userCheckins.reduce((accu, curr, index) => {
    const isCheckin = !!accu[curr.establishmentId]
    if (isCheckin){
      accu[curr.establishmentId].strength ++
    } else {
      accu[curr.establishmentId] = { strength: 1 }
    }
    return accu
  }, {})
  console.log("condenseCheckins", condenseCheckins)

  const castleForEdit = await Promise.all(Object.keys(condenseCheckins).map(async establishmentId => {
    const [matchCastle] = await Castle.findAll({ where: { establishmentId: +establishmentId, kingdomId } })
    console.log('establishmentId', establishmentId, 'kingdomId', kingdomId, 'matchCastle: ', matchCastle)

    return matchCastle
  }))
  console.log('castleForEdit: ', castleForEdit)

  const editedCastle = await Promise.all(castleForEdit.map(async castle => {
    const updateStrength = castle.strength - condenseCheckins[castle.establishmentId].strength
    console.log('updateStrength: ', updateStrength)

    if (updateStrength > 0) {
      return await Castle.update(
        { strength: updateStrength },
        { where: { establishmentId: castle.establishmentId, kingdomId: castle.kingdomId } }
      )
    } else {
      return await Castle.destroy(
        { where: { establishmentId: castle.establishmentId, kingdomId: castle.kingdomId } }
      )
    }
  }))
  console.log('updated?')

  await Checkin.destroy({ where: { userId } })
  res.sendStatus(204)
}))
