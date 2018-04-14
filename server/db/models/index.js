const User = require('./user')
const Establishment = require('./establishment')
const Checkin = require('./checkin')
const Kingdom = require('./kingdom')
const Resource = require('./resource')
const UserResource = require('./userResource')
const Castle = require('./castle')
const Shield = require('./shield')

// //Many to Many
// User.belongsToMany(Establishment, {through: Checkin})
// Establishment.belongsToMany(User, {through: Checkin})

User.belongsToMany(Resource, {through: UserResource})
Resource.belongsToMany(User, {through: UserResource})

Establishment.belongsToMany(Kingdom, {through: Castle})
Kingdom.belongsToMany(Establishment, {through: Castle})

//One to Many
User.belongsTo(Kingdom)
Kingdom.hasMany(User)

Checkin.belongsTo(User)
User.hasMany(Checkin)

Checkin.belongsTo(Establishment)
Establishment.hasMany(Checkin)

//One to One
Shield.belongsTo(Kingdom)

module.exports = {
  User,
  Establishment,
  Checkin,
  Kingdom,
  Castle,
  Shield
}
