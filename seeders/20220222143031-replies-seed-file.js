'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // randomly assign 120 replies to 60 tweets distributed by 6 users
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 120 }, () => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
        comment: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
