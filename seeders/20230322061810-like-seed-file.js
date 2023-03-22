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
    const likes = []
    users.shift()
    users.forEach(user => {
      const randomTweets = new Set()
      // 從推文中隨機選擇三個不重複的推文
      while (randomTweets.size < 3) {
        const checkIndex = Math.floor(Math.random() * tweets.length)
        const tweetIndex = tweets[checkIndex].id
        if (!randomTweets.has(tweetIndex)) {
          randomTweets.add(tweetIndex)
        }
      }

      randomTweets.forEach(tweetId => {
        const randomOffset = Math.floor(Math.random() * 1000 * 60)
        likes.push({
          created_at: new Date(Date.now() - randomOffset).toISOString().replace('T', ' ').replace('Z', ''),
          updated_at: new Date(Date.now() - randomOffset).toISOString().replace('T', ' ').replace('Z', ''),
          user_id: user.id,
          tweet_id: tweetId
        })
      })
    })

    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('likes', {})
  }
}
