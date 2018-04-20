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
      localDomain () {
        return this.establishments ? this.establishments
          .filter(establishment => establishment.kingdom === this.name)
          .length
          : 0
      },
      colonies () {
        return this.domainSize - this.localDomain
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
    },
  })

module.exports = Kingdom;
