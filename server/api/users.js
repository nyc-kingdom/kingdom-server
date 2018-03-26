const router = require('express').Router()
const { User, Kingdom } = require('../db/models')
const asyncHandler = require('express-async-handler')
const flickr = process.env.FLICKR_API_KEY
const googleMap = process.env.GOOGLE_MAP
const axios = require('axios')

module.exports = router

router.get('/', (req, res, next) => {
  User.scope('populated').findAll({
    attributes: ['id', 'username', 'experience']
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

router.put('/:id', asyncHandler(async (req, res, next) => {
  const userId = +req.params.id;
  const { address, username } = req.body
  const googleCoords = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMap}`)
  const { lat, lng } = googleCoords.data.results[0].geometry.location
  const flckr =  await axios.get(`https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=${flickr}&lat=${lat}&lon=${lng}&format=json&nojsoncallback=1`)
  const kingdomName = flckr.data.places.place[0].woe_name
  const kingdom = await Kingdom.scope('populated').findOrCreate({
    where: { name: kingdomName },
  });
  await User.update(
    {
      kingdomId: kingdom[0].dataValues.id,
      username: username
     },
    { where: { id: userId } }
  );
  const updated = await User.scope('populated').findById(userId)
  res.json(updated);
}))
