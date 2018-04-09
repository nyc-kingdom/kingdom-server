const Sequelize = require('sequelize')
const db = require('../db')

const Kingdom = db.define('kingdom', {
  name: {
    type: Sequelize.STRING,
  }
}, {
    scopes: {
      populated: {
        include: [{ all: true }]
      }
    },
    getterMethods: {
      domainSize () {
        return this.establishments ? this.establishments.length : 0
      },
      power () {
        return this.users ? this.users.reduce((power, user) => {
          power += user.experience
          return power
        }, 0)
        : 0
      },
      king () {
        return !this.users ? null : this.users[0] ?
        this.users.sort((first, second) => second.experience - first.experience)[0].id
        : null
      }
    }
  })

module.exports = Kingdom;
