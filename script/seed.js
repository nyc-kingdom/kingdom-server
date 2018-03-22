const db = require('../server/db')
const { User,
  Kingdom,
  Establishment,
  Resource,
  Checkin,
  Castle } = require('../server/db/models')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  await Promise.all([
    Kingdom.create({ name: 'Lefferts Gardens' }),
    Kingdom.create({ name: 'Financial District' }),
    Kingdom.create({ name: 'Bushwick' }),
    Kingdom.create({ name: 'Astoria' })
  ])

  const users = await Promise.all([
    User.scope('populated').create({ email: 'dongwoo@email.com', kingdomId: 2 }),
    User.scope('populated').create({ email: 'connor@gmail.com', kingdomId: 3 }),
    User.scope('populated').create({ email: 'bruce@gmail.com', kingdomId: 4 }),
    User.scope('populated').create({ email: 'phil@email.com', kingdomId: 1 }),
  ])

  await Promise.all([
    Establishment.create({ name: 'Analogue' }),
    Establishment.create({ name: 'Starbucks' }),
    Establishment.create({ name: 'Killarneys' }),
    Establishment.create({ name: 'Fullstack' }),
    Establishment.create({ name: 'Little Mo' }),
    Establishment.create({ name: 'Baby Skips' }),
    Establishment.create({ name: 'Astoria Beer Garden' }),
    Establishment.create({ name: 'PS1' })
  ])

  await Promise.all([
    Checkin.create({ quantity: 1, userId: 1, establishmentId: 3 }),
    Checkin.create({ quantity: 5, userId: 1, establishmentId: 4 }),
    Checkin.create({ quantity: 1, userId: 2, establishmentId: 5 }),
    Checkin.create({ quantity: 2, userId: 2, establishmentId: 6 }),
    Checkin.create({ quantity: 1, userId: 2, establishmentId: 4 }),
    Checkin.create({ quantity: 2, userId: 3, establishmentId: 7 }),
    Checkin.create({ quantity: 5, userId: 3, establishmentId: 8 }),
    Checkin.create({ quantity: 2, userId: 4, establishmentId: 1 }),
    Checkin.create({ quantity: 3, userId: 4, establishmentId: 2 }),
  ])

  await Promise.all([
    Castle.create({ kingdomId: 3, establishmentId: 1 }),
    Castle.create({ strength: 5, kingdomId: 3, establishmentId: 4 }),
    Castle.create({ kingdomId: 4, establishmentId: 5 }),
    Castle.create({ strength: 2, kingdomId: 4, establishmentId: 6 }),
    Castle.create({ kingdomId: 4, establishmentId: 4 }),
    Castle.create({ strength: 2, kingdomId: 1, establishmentId: 7 }),
    Castle.create({ strength: 5, kingdomId: 3, establishmentId: 8 }),
    Castle.create({ strength: 2, kingdomId: 2, establishmentId: 1 }),
    Castle.create({ strength: 3, kingdomId: 2, establishmentId: 2 }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// Execute the `seed` function
// `Async` functions always return a promise, so we can use `catch` to handle any errors
// that might occur inside of `seed`
seed()
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('closing db connection')
    db.close()
    console.log('db connection closed')
  })

/*
 * note: everything outside of the async function is totally synchronous
 * The console.log below will occur before any of the logs that occur inside
 * of the async function
 */
console.log('seeding...')
