const db = require('../server/db')
const { User, Kingdom } = require('../server/db/models')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  await Promise.all([
    Kingdom.create({ name: 'Arlen' }),
    Kingdom.create({ name: 'Dragonstone' }),
    Kingdom.create({ name: 'Meeren' }),
    Kingdom.create({ name: 'Qarth' })
  ])

  await Promise.all([
    User.scope('populated').create({ username: 'RustyShackleford', email: 'bot1@email.com', kingdomId: 1, token: 'S01DZLIWJ0DWGGMHOMXO0VDK4OLKWDXSDT4XYI3SEWT0NFKJ', isBot: true }),
    User.scope('populated').create({ username: 'Rhaegal', email: 'bot2@email.com', kingdomId: 2, token: 'S01DZLIWJ0DWGGMHOMXO0VDK4OLKWDXSDT4XYI3SEWT0NFKJ', isBot: true}),
    User.scope('populated').create({ username: 'Drogon', email: 'bot3@email.com', kingdomId: 3, token: 'S01DZLIWJ0DWGGMHOMXO0VDK4OLKWDXSDT4XYI3SEWT0NFKJ', isBot: true }),
    User.scope('populated').create({ username: 'Viserion', email: 'bot4@email.com', kingdomId: 4, token: 'S01DZLIWJ0DWGGMHOMXO0VDK4OLKWDXSDT4XYI3SEWT0NFKJ', isBot: true }),
  ])
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

console.log('seeding...')
