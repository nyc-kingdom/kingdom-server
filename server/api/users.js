const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  User.scope('populated').findAll({
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})


router.get('/:id', async (req, res, next) => {
  try {
  const user = await User.findById(+req.params.id, {include: [{ all: true, nested: true }]})
  res.json(user);
  } catch (error) {
    next(error);
  }
})

