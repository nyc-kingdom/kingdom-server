const Sequelize = require('sequelize')
const db = require('../db')

const Shield = db.define('shield', {
  image: {
    type: Sequelize.BLOB,
  }
}, {
  scopes: {
    populated: {
      include: [{ all: true }]
    }
  }
})

module.exports = Shield;
