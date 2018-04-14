const router = require('express').Router();
const { Shield } = require('../db/models');
const asyncHandler = require('express-async-handler')
module.exports = router;

router.get('/', asyncHandler(async (req, res, next) => {
  const shields = await Shield.findAll()
  res.json(shields)
}))

router.get('/:kingdomId', asyncHandler(async (req, res, next) => {
    const kingdomId = req.params.kingdomId
    const shield = await Shield.findOne({ where: { kingdomId }})
    res.json(shield)
}))

router.post('/', asyncHandler(async (req, res, next) => {
    const newShield = await Shield.create(req.body)
    res.status(201).json(newShield)
}))

router.put('/:shieldId/:kingdomId', asyncHandler(async (req, res, next) => {
    const id = req.params.shieldId
    const kingdomId = req.params.kingdomId
    const resignShield = await Shield.update({ kingdomId: null }, { where: { kingdomId } })
    const [isUpdate, [assignShield]] = await Shield.update({ kingdomId }, { where: { id }, returning: true })
    console.log("isUpdate: ", isUpdate, "assignShield: ", assignShield)
    res.json(assignShield)
}))

router.delete('/:shieldId', asyncHandler(async (req, res, next) => {
    const id = req.params.shieldId
    const garbage = await Shield.destroy({ where: { id }})
    res.sendStatus(204)
}))
