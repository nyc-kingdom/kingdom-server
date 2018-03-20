const router = require('express').Router()
const {Establishment, Kingdom} = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router

router.get('/', asyncHandler(async(req, res, next) => {
  const kingdoms = await Kingdom.scope('populated').findAll()
  res.json(kingdoms)
}))

router.put('/', asyncHandler(async(req, res, next) => {
  const kingdom = await Kingdom.scope('populated').findOrCreate({ where: req.body })
  res.json(kingdom[0])
}))
