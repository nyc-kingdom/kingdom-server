//import { Promise } from '../../../../../Library/Caches/typescript/2.6/node_modules/@types/bluebird';

/**
 * Welcome to the seed file! This seed file uses a newer language feature called...
 *
 *                  -=-= ASYNC...AWAIT -=-=
 *
 * Async-await is a joy to use! Read more about it in the MDN docs:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 *
 * Now that you've got the main idea, check it out in practice below!
 */
const db = require('../server/db')
const { User, Kingdom, Establishment, Resource, Checkin} = require('../server/db/models')

async function seed () {
  await db.sync({force: true})
  console.log('db synced!')
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  await Promise.all([
    Kingdom.create({name: 'Lefferts Gardens'}),
    Kingdom.create({name: 'Financial District'}),
    Kingdom.create({name: 'Bushwick'}),
    Kingdom.create({name: 'Astoria'})
  ])

  const users = await Promise.all([
    User.create({email: 'dongwoo@email.com', kingdomId: 2}),
    User.create({email: 'connor@gmail.com', kingdomId: 3}),
    User.create({email: 'bruce@gmail.com', kingdomId: 4}),
    User.create({email: 'phil@email.com', kingdomId: 1}),
  ])

  await Promise.all([
    Establishment.create({name: 'Analogue', kingdomId: 1}),
    Establishment.create({name: 'Starbucks', kingdomId: 1}),
    Establishment.create({name: 'Killarneys', kingdomId: 2}),
    Establishment.create({name: 'Fullstack', kingdomId: 2}),
    Establishment.create({name: 'Little Mo', kingdomId: 3}),
    Establishment.create({name: 'Baby Skips', kingdomId: 3}),
    Establishment.create({name: 'Astoria Beer Garden', kingdomId: 4}),
    Establishment.create({name: 'PS1', kingdomId: 4})
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
