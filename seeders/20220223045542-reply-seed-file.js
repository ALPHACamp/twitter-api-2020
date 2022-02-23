'use strict';

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    users.shift()
    
    const tweets = await queryInterface.sequelize.query(
        'SELECT id, UserId FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    
    for (const tweet of tweets) {
      await queryInterface.bulkInsert('Replies', 
        Array.from({ length: 1 }, () => ({
        comment: faker.lorem.text(140),
        UserId: tweet.UserId,
        TweetId: tweet.id,
        createdAt: new Date(),
        updatedAt: new Date()
        }))
      )
    }
    for (const tweet of tweets) {
      await queryInterface.bulkInsert('Replies', 
        Array.from({ length: 2 }, () => ({
        comment: faker.lorem.text(140),
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweet.id,
        createdAt: new Date(),
        updatedAt: new Date()
        }))
      )
    }

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
 }
};

