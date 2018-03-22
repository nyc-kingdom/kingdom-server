const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  foursquareId: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  },
  isEdited: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  experience: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  scopes: {
    populated: {
      include: [{ all: true}]
    }
  },
})

module.exports = User

function calcExperience(establishments) {
  return establishments.reduce((experience, establishment) => {
    experience += establishment.checkin.quantity
    console.log('this is experience', experience)
    return experience
  }, 0)
}

User.beforeUpdate(user => {
  if (user.establishments && user.establishments.length) {
    user.experience = calcExperience(user.establishments)
  }
  user.increment('experience')
})

User.afterCreate(user => {
  console.log(user.establishments)
  if (user.establishments && user.establishments.length) {
    user.experience = calcExperience(user.establishments)
  }
})
