'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const [ users , tweets ] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE account <> "root";',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
     tweets.map(tweet => {
      replies.push(...Array.from({ length: 3 }, () => ({
        comment: faker.lorem.paragraph().substring(0, 140),
        tweet_id: tweet.id,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })))
    })
    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
