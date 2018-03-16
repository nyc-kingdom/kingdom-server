const Sequelize = require('sequelize');
const db = require('../db');

const Checkin = db.define('checkin', {
  quantity: {
    type: Sequelize.INTEGER
  }
})

module.exports = Checkin;
