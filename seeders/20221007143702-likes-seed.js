'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Likes', Array.from({ length: users.length *10 }, (_, i) => ({
      user_id: users[i % users.length].id,
      tweet_id: tweets[Math.floor(Math.random() * tweets.length)]?.id,
      created_at: new Date(),
      updated_at: new Date()
    })))},
  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Likes', {});
  }
}
