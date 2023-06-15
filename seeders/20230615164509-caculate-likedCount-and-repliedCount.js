'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
    `UPDATE Tweets 
     SET LikedCount = COALESCE(
       (SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweets.id),
       0
     ),
     repliedCount = COALESCE(
       (SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweets.id),
       0
     )`
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', { LikedCount: null, repliedCount: null })
  }
}
