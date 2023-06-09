'use strict';
const faker = require('faker');
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
    const replies = []
    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < 3; j++) {
        replies.push({
          comment: faker.lorem.sentence(),
          tweetId: tweets[i].id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
    await (queryInterface.bulkInsert('Replies', replies))
  },

  down: async (queryInterface, Sequelize) => {
    await (queryInterface.bulkDelete('Replies', {}))
  }
};
