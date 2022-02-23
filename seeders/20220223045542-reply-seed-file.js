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
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    const replyPerTweet = 3
    const replyCount = replyPerTweet * tweets.length

    for ( let i = 0; i < replyCount; i++) {
      await queryInterface.bulkInsert('Replies', [{
        comment: faker.lorem.text(140),
        UserId: users[Math.floor(i % users.length)].id,
        TweetId: tweets[Math.floor(i / tweets.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
     }  
    },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
 }
};

