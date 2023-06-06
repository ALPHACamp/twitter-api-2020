'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // find user id first and exclude admin account
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE name <> 'root';", // WHERE role <> 'admin'找不到東西
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // find all tweets id
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const likes = []
    // Each user randomly likes 3 tweets
    const numOfLikes = 3
    users.forEach(user => {
      const unlikeTweets = tweets.map(tweet => tweet.id)
      for (let i = 0; i < numOfLikes; i++) {
        const randomIndex = Math.floor(Math.random() * unlikeTweets.length)
        likes.push({
          UserId: user.id,
          TweetId: unlikeTweets[randomIndex],
          isLike: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        // avoid to like same tweet
        unlikeTweets.splice(randomIndex, 1)
      }
    })
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
