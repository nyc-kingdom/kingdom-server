const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.get('/loggedIn', async (req, res, next) => {
  console.log('hit me');
  try {
    const user = await User.findOne({
      where: {isLoggedIn: true}
    })
    res.json(user);
  } catch (error) {
    next(error);
  }
})


router.get('/:id', async (req, res, next) => {
  try {
  const user = await User.findById(+req.params.id, {include: [{ all: true, nested: true }]})
  res.json(user);
  } catch (error) {
    next(error);
  }
})

