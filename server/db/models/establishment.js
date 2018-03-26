const Sequelize = require('sequelize')
const db = require('../db')

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
  },
  kingdom: {
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
        return this.checkins && this.checkins.length ? mostCheckins(this.checkins) : null
      },
      allegiance() {
        return this.kingdoms && this.kingdoms.length ? strongestKingdom(this.kingdoms) : null
      },
      popularity() {
        return this.checkins ? this.checkins.length : 0
      }
    }
  })

function mostCheckins(checkins) {
  const sortedCheckins = checkins.sort((first, next) => first.quantity - next.quantity)
  return sortedCheckins[sortedCheckins.length - 1].userId
}

function strongestKingdom(kingdoms) {
  const sortedKingdom = kingdoms.sort((first, next) => first.castle.strenth - next.castle.strenth)
  return sortedKingdom[sortedKingdom.length - 1].id
}

module.exports = Establishment;
