'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likes = []

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 20; j++) {
        const like = {
          like_unlike: true,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: users[i].id,
          tweet_id: tweets[Math.floor(Math.random() * tweets.length)].id
        }
        if (i === 0 || like.tweet_id !== likes[i - 1].tweet_id) likes.push(like)
      }
    }
    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
