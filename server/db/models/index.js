const User = require('./user');
const Establishment = require('./establishment');
const Checkin = require('./checkin');

User.belongsToMany(Establishment, {through: Checkin});
Establishment.belongsToMany(User, {through: Checkin});

module.exports = {
  User,
  Establishment,
  Checkin
}
