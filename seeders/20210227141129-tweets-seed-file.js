'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const genFakeTweet = () => {
      const tweets = []
      let tweetId = 0
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
          tweets.push({
            id: ++tweetId,
            UserId: i + 2,
            description: `Johnny${i + 1} is a handsome guy.`,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        } 
      }
      return tweets
    }
    const fakeTweets = genFakeTweet()
    await queryInterface.bulkInsert('Tweets', fakeTweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
