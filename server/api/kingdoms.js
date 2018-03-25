const router = require('express').Router()
const { Kingdom } = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router

router.get('/', asyncHandler(async(req, res, next) => {
  const kingdoms = await Kingdom.scope('populated').findAll()
  res.json(kingdoms)
}))
