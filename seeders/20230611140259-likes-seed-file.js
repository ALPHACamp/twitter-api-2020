'use strict'

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
            type: queryInterface.sequelize.QueryTypes.SELECT
        })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', {
            type: queryInterface.sequelize.QueryTypes.SELECT
        })
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 30 }, () => ({
        UserId: users[Math.floor(Math.random() * users.length)].id, 
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id, 
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
