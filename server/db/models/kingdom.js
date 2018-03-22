const Sequelize = require('sequelize');
const db = require('../db');

const Kingdom = db.define('kingdom', {
  name: {
    type: Sequelize.STRING,
  },
  royalty: {
    type: Sequelize.STRING
  }
}, {
    scopes: {
      populated: {
        include: [{ all: true, nested: true }]
      }
    },
  })

module.exports = Kingdom;
