const Sequelize = require('sequelize');
const db = require('../db');

const Castle = db.define('castle', {
  strength: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
}, {
  scopes: {
    populated: {
      include: [{ all: true }]
    }
  }
})

module.exports = Castle;

Castle.prototype.addStrength = function () {
  this.increment('strength')
}
