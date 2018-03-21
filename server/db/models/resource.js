const Sequelize = require('sequelize');
const db = require('../db');

const Resource = db.define('resource', {
  name: {
    type: Sequelize.STRING,
  },
}, {
    scopes: {
      populated: {
        include: [{ all: true, nested: true }]
      }
    }
  })

module.exports = Resource;
