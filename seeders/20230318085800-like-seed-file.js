'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    function randomNum (num) {
      return Math.floor(Math.random() * num) + 1
    }
    const likes = []
    users.forEach(user => {
      const tweetsOption = [...tweets]
      const numsOfLike = randomNum(tweets.length)
      for (let i = 0; i < numsOfLike; i++) {
        const index = randomNum(tweetsOption.length) - 1
        likes.push({
          UserId: user.id,
          TweetId: tweetsOption[index].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        tweetsOption.splice(index, 1)
      }
    })
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
