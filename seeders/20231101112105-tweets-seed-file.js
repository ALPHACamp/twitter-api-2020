'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetData = [];
    for (let i = 1; i < users.length; i++) {
      for (let j = 0; j < 10; j++) {
        const newTweet = {
          UserId: users[i].id,
          description: faker.lorem.text().substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        tweetData.push(newTweet);
      }
    }
    await queryInterface.bulkInsert('Tweets', tweetData);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}