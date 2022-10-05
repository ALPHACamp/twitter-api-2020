'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweetArray = []
    for (let i = 2; i <= 6; i++) {
      for (let j = 1; j <= 10; j++) {
        tweetArray.push({
          description: `user${i}，推文測試第 ${j} 篇文章`,
          User_id: i,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Tweets', tweetArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets')
  }
}
