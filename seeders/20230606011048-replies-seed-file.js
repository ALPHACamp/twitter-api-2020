'use strict';
const faker = require('faker')

module.exports = {
  up: async(queryInterface, Sequelize) => {
  const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
            type: queryInterface.sequelize.QueryTypes.SELECT
        })
  const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', {
            type: queryInterface.sequelize.QueryTypes.SELECT
        })
    const replies = []
    for (const tweet of tweets) {
      for (let i = 0; i < 3; i++) {
        replies.push({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          TweetId: tweet.id,
          comment: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
