const router = require('express').Router()
const { Checkin } = require('../db/models')
module.exports = router
const asyncHandler = require('express-async-handler')

// GET api/checkins?userId=5
// GET api/checkins?establishmentId=3
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const checkins = await Checkin.scope('populated').findAll({
            where: req.query,
        })

        res.json(checkins)
    }),
)

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { userId, establishmentId } = req.body
        const checkin = await Checkin.scope('populated').create({
            userId: +userId,
            establishmentId: +establishmentId,
            lastCheckin: new Date(),
        })
        res.json(checkin)
    }),
)

router.put('/', async (req, res, next) => {
    try {
        const userId = +req.query.user
        const establishmentId = +req.query.establishment
        const checkin = await Checkin.scope('populated').findOne({
            where: { userId: userId, establishmentId: establishmentId },
        })
        const updated = await checkin.update({ lastCheckin: new Date() })
        res.json(updated)
    } catch (error) {
        next(error)
    }
})
