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
  },
})

module.exports = Establishment;
