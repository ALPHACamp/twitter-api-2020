'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Replies', Array.from({ length: 150 }, (_, index) => ({
      comment: faker.lorem.text(20),
      createdAt: new Date(),
      updatedAt: new Date(),
      TweetId: tweets[index % 50].id,
      UserId: users[index % 5].id
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
