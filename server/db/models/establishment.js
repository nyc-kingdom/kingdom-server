const Sequelize = require('sequelize')
const db = require('../db')
const Checkin = require('./checkin')

const Establishment = db.define('establishment', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fourSquareId: {
    type: Sequelize.STRING
  },
  latitude: {
    type: Sequelize.DECIMAL
  },
  longitude: {
    type: Sequelize.DECIMAL
  }, kingdom: {
    type: Sequelize.STRING
  }
}, {
    scopes: {
      populated: {
        include: [{ all: true }]
      }
    },
    getterMethods: {
      keeper() {
        if (this.users && this.users.length) return mostCheckins(this.users).id
      },
      kingdom() {

      }
    }
  })

function mostCheckins(users) {
  return users.reduce((greatest, user) => {
    if (!greatest.checkin) greatest = user
    if (greatest.checkin.quantity < user.checkin.quantity) greatest = user
    return greatest
  }, {})
}


module.exports = Establishment;
