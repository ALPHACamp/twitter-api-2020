'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_NUMBER = 100
    const tweets = await queryInterface.sequelize.query(
      `SELECT Tweets.id, Tweets.User_id, Users.id AS random_user_id
      FROM Tweets
      JOIN Users ON Users.role='user' AND Users.id <> Tweets.User_id
      ORDER BY RAND()
      limit ${DEFAULT_NUMBER}`, { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Likes',
      tweets.map(tweet => ({
        User_id: tweet.random_user_id,
        Tweet_id: tweet.id,
        created_at: new Date(),
        updated_at: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
