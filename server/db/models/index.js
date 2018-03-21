const User = require('./user')
const Establishment = require('./establishment')
const Checkin = require('./checkin')
const Kingdom = require('./kingdom')
const Resource = require('./resource')
const UserResource = require('./userResource')

//Many to Many
User.belongsToMany(Establishment, {through: Checkin})
Establishment.belongsToMany(User, {through: Checkin})

User.belongsToMany(Resource, {through: UserResource})
Resource.belongsToMany(User, {through: UserResource})

//One to Many
User.belongsTo(Kingdom)
Kingdom.hasMany(User)

Establishment.belongsTo(Kingdom)
Kingdom.hasMany(Establishment)

module.exports = {
  User,
  Establishment,
  Checkin,
  Kingdom
}
