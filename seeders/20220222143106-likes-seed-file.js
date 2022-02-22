'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // randomly set (tweets.length * 2) likes for 6 users to their 60 tweets, no duplicate like
    const likeArray = []
    do {
      let UserId = users[Math.floor(Math.random() * users.length)].id
      let TweetId = tweets[Math.floor(Math.random() * tweets.length)].id

      if (!likeArray.some(like => like.UserId === UserId && like.TweetId === TweetId)) {
        likeArray.push({
          UserId,
          TweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } while (likeArray.length < tweets.length * 2)


    await queryInterface.bulkInsert('Likes', likeArray)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}