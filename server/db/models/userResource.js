const Sequelize = require('sequelize')
const db = require('../db')

const UserResource = db.define('userResource', {
  quantity: {
    type: Sequelize.INTEGER,
  },
}, {
    scopes: {
      populated: {
        include: [{ all: true}]
      }
    }
  })

module.exports = UserResource
