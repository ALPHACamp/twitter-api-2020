'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // create 10 tweets for each user
    const tweets = []
    for (const user of users) {
      for (let i = 1; i <= 10; i++) {
        tweets.push({
          user_id: user.id,
          description: faker.lorem.text().slice(0, 140),
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    }
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
