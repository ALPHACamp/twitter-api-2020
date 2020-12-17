'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const likes = []
      //every user liked 1 ~ 7 tweets
      for (let UserId = 2; UserId <= 6; UserId++) {
        const startTweetId = Math.ceil(Math.random() * 40)
        for (let i = 1; i <= Math.ceil(Math.random() * 7); i++) {
          likes.push({
            TweetId: startTweetId + i,
            UserId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Likes', likes)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Likes', {})
    } catch (error) {
      console.log(error)
    }
  }
};
