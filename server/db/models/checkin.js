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

// Checkin.beforeUpdate(async (checkin) => {
//   console.log(checkin.quantity);
//   //await checkin.update({quantity: (this.quantity++)})
// })
  
module.exports = Checkin;
