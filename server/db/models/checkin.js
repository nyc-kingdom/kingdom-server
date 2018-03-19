const Sequelize = require('sequelize');
const db = require('../db');

const Checkin = db.define('checkin', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  lastCheckin: {
    type: Sequelize.DATE,
  }
})

Checkin.beforeUpdate(checkin => {
  checkin.quantity = checkin.quantity += 1;
})
  
module.exports = Checkin;
