const router = require('express').Router()
const { Establishment, Checkin, Castle, User } = require('../db/models')
const asyncHandler = require('express-async-handler')
module.exports = router
const axios = require('axios')
const flickr = process.env.FLICKR_API_KEY
const FOURSQUARESECRET = process.env.FOURSQUARE_CLIENT_SECRET
const FOURSQUAREID = process.env.FOURSQUARE_ID

router.get('/', asyncHandler(async (req, res, next) => {
  const establishments = await Establishment.scope('populated').findAll()
  res.json(establishments)
}))

router.get('/:id', asyncHandler(async (req, res, next) => {
  const establishment = await Establishment.scope('populated').findById(+req.params.id)
  res.json(establishment)
}))

router.put('/', asyncHandler(async (req, res, next) => {
  const { place, user } = req.body
  const { id, location, name } = place
  const fsq = await axios.post(`https://api.foursquare.com/v2/checkins/add?venueId=${place.id}&v=20170801&oauth_token=${user.token}`)
  const checkinId = fsq.data.response.checkin.id
  const establishment = await findOrCreateEstablishment(name, id, location.lat, location.lng)
  const checkin = await createCheckin(user, establishment.id, checkinId)
  res.json(checkin)
}))

router.put('/foursquare', asyncHandler(async (req, res, next) => {
  const user = req.body.user
  const foursquareCheckins = await axios.get(`https://api.foursquare.com/v2/users/self/checkins?v=20170801&oauth_token=${user.token}`)
  const checkinsArr = foursquareCheckins.data.response.checkins.items
  const inDb = await Checkin.findAll({where: {userId: user.id}})
  const filteredCheckins = checkinsArr.filter(checkin => !inDb.find(elem => elem.fourSquareId === checkin.id))
  const establishmentArr = filteredCheckins.map(checkin => checkin.venue)
    .reduce((array, venue) => {
      if (!array.length) array.push(venue)
      else if (!array.find(elem => elem.fourSquareId === venue.id)) array.push(venue)
      return array
    }, [])
  await Promise.all(establishmentArr.map(async(place) => {
    const { id, name, location } = place
    const establishments = await findOrCreateEstablishment(name, id, location.lat, location.lng)
    return establishments
  }))
  const checkins = await Promise.all(filteredCheckins.map(async(checkin) => {
    const establishment = await Establishment.findOne({where: {fourSquareId: checkin.venue.id}})
    return createCheckin(user, establishment.id, checkin.id)
  }))
  res.send(checkins)
}))

router.put('/bots', asyncHandler(async(req, res, next) => {
  const { userInput, token, near } = req.query
  const response = await axios.get(`https://api.foursquare.com/v2/venues/explore?client_id=${FOURSQUAREID}&client_secret=${FOURSQUARESECRET}&near=${near}&query=${userInput}&sortByDistance=1&oauth_token=${token}&v=20170801&limit=10`)
  const payLoad = response.data
  const user = req.body.user
  const { id, location, name } = place
}))

async function findOrCreateEstablishment(name, fourSquareId, latitude, longitude ) {
  const flckr =  await axios.get(`https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=${flickr}&lat=${latitude}&lon=${longitude}&format=json&nojsoncallback=1`)
  const kingdom = flckr.data.places.place[0].name.split(', ').slice(0, 2).join(', ') //Kingdom Name With State
  // const kingdom = flckr.data.places.place[0].woe_name
  const establishment = await Establishment.scope('populated').findOrCreate({
    where: { fourSquareId },
    defaults: { name, fourSquareId, latitude, longitude, kingdom }
  })
  return establishment[0]
}

async function createCheckin(user, establishmentId, fourSquareId) {
  const checkin = await Checkin.create({ userId: user.id, establishmentId, fourSquareId }, {include: [{ all: true }]})
  await updateKeeper(establishmentId)
  await updateCastle(user.kingdomId, establishmentId)
  const populatedCheckIn = Checkin.scope('populated').findOne({where: {id: checkin.id}})
  return populatedCheckIn
}

async function updateKeeper(establishmentId) {
  const establishment = await Establishment.scope('populated').findById(establishmentId)
  const keeper = await User.scope('populated').findById(establishment.keeper)
  await keeper.update({ isEdited: true })
}

async function updateCastle(kingdomId, establishmentId) {
  const castle = await Castle.findOrCreate({
    where: { kingdomId, establishmentId }
  })
  if (!castle[1]) await castle[0].addStrength()
}
