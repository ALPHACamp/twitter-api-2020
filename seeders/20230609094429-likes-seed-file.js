'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [tweets, users] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Tweets;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE role <> 'admin'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    const likes = [
      {
        UserId: users[0].id,
        TweetId: tweets[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: users[0].id,
        TweetId: tweets[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        UserId: users[1].id,
        TweetId: tweets[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        UserId: users[3].id,
        TweetId: tweets[15].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        UserId: users[4].id,
        TweetId: tweets[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
