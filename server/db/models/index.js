const User = require('./user');
const Establishment = require('./establishment');
const Checkin = require('./checkin');
const Kingdom = require('./kingdom');

User.belongsToMany(Establishment, {through: Checkin});
Establishment.belongsToMany(User, {through: Checkin});

User.belongsTo(Kingdom);
Kingdom.hasMany(User);

Establishment.belongsTo(Kingdom);
Kingdom.hasMany(Establishment);

module.exports = {
  User,
  Establishment,
  Checkin,
  Kingdom
}
