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
    Establishment.create({ name: 'Analogue', latitude: 40.669605, longitude: -73.995514, fourSquareId: '1', kingdom: 'Lefferts Gardens' }),
    Establishment.create({ name: 'Starbucks', latitude: 40.673823, longitude: -73.999095, fourSquareId: '2', kingdom: 'Lefferts Gardens' }),
    Establishment.create({ name: 'Killarneys', latitude: 40.673938, longitude: -74.109050, fourSquareId: '3', kingdom: 'Financial District'  }),
    Establishment.create({ name: 'Fullstack', latitude: 40.705076, longitude: -74.009160, fourSquareId: '4', kingdom: 'Financial District'}),
    Establishment.create({ name: 'Little Mo', latitude: 40.696494, longitude: -73.929491, fourSquareId: '5', kingdom: 'Bushwick' }),
    Establishment.create({ name: 'Baby Skips', latitude: 40.702962, longitude: -73.930221, fourSquareId: '6', kingdom: 'Bushwick'  }),
    Establishment.create({ name: 'Astoria Beer Garden', latitude: 40.769801, longitude: -73.922956, fourSquareId: '7', kingdom: 'Astoria' }),
    Establishment.create({ name: 'PS1', latitude: 40.745595, longitude: -73.947095, fourSquareId: '8', kingdom: 'Astoria' })
  ])

  await Promise.all([
    Checkin.create({ quantity: 1, userId: 1, establishmentId: 3, fourSquareIds: ['1', '2', '3'] }),
    Checkin.create({ quantity: 5, userId: 1, establishmentId: 4, fourSquareIds: ['4', '5', '6'] }),
    Checkin.create({ quantity: 1, userId: 2, establishmentId: 5, fourSquareIds: ['7', '8', '9'] }),
    Checkin.create({quantity: 2, userId: 2, establishmentId: 6}),
    Checkin.create({quantity: 5, userId: 2, establishmentId: 4}),
    Checkin.create({quantity: 2, userId: 3, establishmentId: 7}),
    Checkin.create({quantity: 5, userId: 3, establishmentId: 8}),
    Checkin.create({quantity: 2, userId: 4, establishmentId: 1}),
    Checkin.create({quantity: 3, userId: 4, establishmentId: 2}),
    
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
