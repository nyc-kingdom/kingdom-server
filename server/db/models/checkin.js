const Sequelize = require('sequelize')
const db = require('../db')
const User = ('./user')
const Checkin = db.define('checkin', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
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
        include: [{ all: true, nested: true }]
      }
    }
  })

// Checkin.beforeUpdate(checkin => {
//   checkin.quantity = checkin.quantity += 1;
// })

module.exports = Checkin;
