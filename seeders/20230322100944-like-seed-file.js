'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取使用者id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 取推文id
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets ;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 每名使用者
    for (const user of users) {
      const likes = []
      // 喜歡5則推文
      for (let i = 0; i < 5; i++) {
        // 以do-while確保使用者不同
        let randomTweetId
        do {
          randomTweetId = tweets[Math.floor(Math.random() * tweets.length)].id
        } while (likes.some(like => like.TweetId === randomTweetId)) // 若已存在則再次隨機
        likes.push({
          UserId: user.id,
          TweetId: randomTweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      // 建立追蹤
      await queryInterface.bulkInsert('Likes', likes)
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
