const router = require('express').Router();
const asyncHandler = require('express-async-handler')
module.exports = router;
const axios = require('axios')
const FOURSQUARESECRET = process.env.FOURSQUARE_CLIENT_SECRET
const FOURSQUAREID = process.env.FOURSQUARE_ID

router.get('/', asyncHandler(async (req, res, next) => {
  const { userInput, token } = req.query
  const response = await axios.get(`https://api.foursquare.com/v2/venues/explore?client_id=${FOURSQUAREID}&client_secret=${FOURSQUARESECRET}&ll=40.741895, -73.989308&query=${userInput}&sortByDistance=1&oauth_token=${token}&v=20170801&limit=10`)
  const payLoad = response.data
  res.send(payLoad)
}))
