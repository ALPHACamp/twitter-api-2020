'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      `SELECT Tweets.id, Tweets.User_id, Users.id AS random_user_id
      FROM Tweets
      JOIN Users ON Users.role='user' AND Users.id <> Tweets.User_id
      ORDER BY RAND()`, { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Replies',
      tweets.map(tweet => ({
        User_id: tweet.random_user_id,
        Tweet_id: tweet.id,
        comment: faker.lorem.sentence(5),
        created_at: faker.date.between('2023-03-20T00:00:00.000Z', '2023-03-28T00:00:00.000Z'),
        updated_at: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
