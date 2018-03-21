const Sequelize = require('sequelize')
const db = require('../db')
const Checkin = require('./checkin')

const Establishment = db.define('establishment', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
  },
  latitude: {
    type: Sequelize.INTEGER,
  },
  longitude: {
    type: Sequelize.INTEGER,
  }
}, {
    scopes: {
      populated: {
        include: [{ all: true}]
      }
    },
    getterMethods: {
      // async keeper() {
      //   const checkins = await Checkin.findAll({
      //     where: {establishmentId: this.id}
      //     })
      //   const greatestQuantity = mostCheckins(checkins)
      //   console.log(greatestQuantity.userId)
      //   return greatestQuantity.userId
      // }
      keeper() {
        if (this.users && this.users.length) return mostCheckins(this.users).id
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
