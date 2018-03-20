const Sequelize = require('sequelize');
const db = require('../db');

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
        include: [{ all: true, nested: true }]
      }
    }
  })

module.exports = Establishment;
