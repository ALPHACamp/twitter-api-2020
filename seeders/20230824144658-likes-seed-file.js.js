'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const likes = []

    tweets.forEach(tweet => {
      likes.push(
        ...Array.from({ length: 2 }, () => ({
          User_id: users[Math.floor(Math.random() * users.length)].id,
          Tweet_id: tweet.id,
          created_at: new Date(),
          updated_at: new Date()
        })
        ))
    })
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
}
