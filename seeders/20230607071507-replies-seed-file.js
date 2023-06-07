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

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }, (v, i) => ({

        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: users[i % 5].id,
        TweetId: tweets[Math.floor(i / 3)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
