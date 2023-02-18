'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id, role FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const evenUsers = []
    const evenTweets = []
    const likeRecords = []

    users.forEach(user => {
      if (user.id % 2 === 0 && user.role === 'user') { evenUsers.push(user) }
    })
    tweets.forEach(tweet => {
      if (tweet.id % 2 === 0) { evenTweets.push(tweet) }
    })
    for (let user of evenUsers){
      for (let tweet of evenTweets){
        likeRecords.push({ userId: user.id, tweetId: tweet.id})
      }
    }

    await queryInterface.bulkInsert('Likes', Array.from(likeRecords, value => ({
      user_id: value.userId,
      tweet_id: value.tweetId,
      created_at: new Date(),
      updated_at: new Date()
    })))},
  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Likes', {});
  }
}
