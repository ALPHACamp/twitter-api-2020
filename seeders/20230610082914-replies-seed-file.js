'use strict'
const faker = require('faker')
const usersIdPool = []
const randomUser = []

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    users.map(u => usersIdPool.push(u.id))

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < 3; j++) {
        randomUser.push(usersIdPool.pop(Math.floor(Math.random() * usersIdPool.length)))
      }

      for (let k = 0; k < 3; k++) {
        await queryInterface.bulkInsert('Replies', [{
          user_id: Number(randomUser[k]),
          tweet_id: Number(tweets[i].id),
          comment: faker.lorem.words(Math.floor((Math.random() * 8)) + 1),
          created_at: new Date(),
          updated_at: new Date()
        }])
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
