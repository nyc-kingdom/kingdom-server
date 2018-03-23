const router = require('express').Router()
const { Establishment, Checkin, Castle, User } = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router
const axios = require('axios')
const flickr = process.env.FLICKR_API_KEY

router.get('/', asyncHandler(async (req, res, next) => {
  const establishments = await Establishment.scope('populated').findAll();
  res.json(establishments);
}))

router.post('/', asyncHandler(async (req, res, next) => {
  const { name, fourSquareId, userId, kingdomId } = req.body;
  const establishment = await Establishment.scope('populated').create({
    name, fourSquareId
  })
  const establishmentId = establishment.id
  await Checkin.create({ userId, establishmentId })
  await Castle.create({ kingdomId, establishmentId })
  res.json(establishment);
}
))

router.put('/', asyncHandler(async (req, res, next) => {
  const { place, user } = req.body
  const { id, location, name } = place
  const latitude = location.lat
  const longitude = location.lng
  const fourSquareId = id
  const flckr =  await axios.get(`https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=${flickr}&lat=${latitude}&lon=${longitude}&format=json&nojsoncallback=1`)

  const fsq = await axios.post(`https://api.foursquare.com/v2/checkins/add?venueId=${place.id}&v=20170801&oauth_token=${user.token}`).data
  const kingdom = flckr.data.places.place[0].woe_name
  console.log(fsq)

      // Promise.all([flckr, fsq]).then(resArr => {
      //   const kingdom = flckr.places.place[0].woe_name
      //   console.log('THIS IS OUR KINGDOM ', kingdom)
      //   console.log('CHECKIN BUNDLE ', fsq)

  const establishment = await Establishment.scope('populated').findOrCreate({
    where: { fourSquareId },
    defaults: { name, fourSquareId, latitude, longitude, kingdom }
  })
  const establishmentId = establishment[0].id
  const checkin = await createCheckin(user.id, establishmentId)
  await updateKeeper(establishmentId)
  await updateCastle(user.kingdomId, establishmentId)
  res.json(checkin)
}))

async function createCheckin(userId, establishmentId) {
  const checkin = await Checkin.scope('populated').findOrCreate({
    where: { userId, establishmentId },
    defaults: { lastCheckin: new Date() }
  });
  const updated = checkin[1] ? checkin[0] : await checkin[0].update({ lastCheckin: new Date() })
  return updated
}

async function updateKeeper(establishmentId) {
  const establishment = await Establishment.scope('populated').findById(establishmentId)
  const keeper = await User.scope('populated').findById(establishment.keeper)
  await keeper.update({ isEdited: true })
  console.log('this is experience:', keeper.experience)
}

async function updateCastle(kingdomId, establishmentId) {
  const castle = await Castle.findOrCreate({
    where: { kingdomId, establishmentId }
  })
  if (!castle[1]) await castle[0].addStrength()
  console.log('this is strength:', castle[0].strength)
}
