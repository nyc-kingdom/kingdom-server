const router = require('express').Router()
const { User, Kingdom, Establishment } = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router

router.get('/users', asyncHandler(async(req, res, next) => {
  const users = await User.findAll()
  const topUsers = topTen(users, 'experience')
  res.json(topUsers)
}))

router.get('/users/:kingdomId', asyncHandler(async(req, res, next) => {
  const kingdom = await Kingdom.scope('populated').findById(+req.params.kingdomId)
  const topUsers = topTen(kingdom.users, 'experience')
  res.json(topUsers)
}))

router.get('/kingdoms', asyncHandler(async(req, res, next) => {
  const kingdoms = await Kingdom.scope('populated').findAll()
  const topKingdoms = topTen(kingdoms, 'power')
  res.json(topKingdoms)
}))

router.get('/establishments', asyncHandler(async(req, res, next) => {
  const establishments = await Establishment.scope('populated').findAll()
  const topEstablishments = topTen(establishments, 'popularity')
  res.json(topEstablishments)
}))

function topTen(modelArr, key) {
  return modelArr.sort((first, second) => first[key] - second[key])
  .reverse()
  .slice(0, 10)
}
