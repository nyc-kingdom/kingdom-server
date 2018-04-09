const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')

const Checkin = db.define('checkin', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  lastCheckin: {
    type: Sequelize.DATE,
  },
  fourSquareId: {
    type: Sequelize.STRING
  }
}, {
    scopes: {
      populated: {
        include: [{ all: true}]
      }
    }
  })

Checkin.beforeCreate(async (checkin) => {
  const user = await User.scope('populated').findById(checkin.userId)
  const checkins = user.checkins.filter(elem => elem.establishmentId === checkin.establishmentId)
  const quantity = checkins.length += 1
  checkin.quantity = quantity
})

module.exports = Checkin;
