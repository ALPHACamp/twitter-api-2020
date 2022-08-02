'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function shuffle(arr) {
      const n = arr.length;
      for (let i = n - 1; i > 0; i -= 1) {
        const rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
      }
      return arr
    }

    const likes = []

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
   
    const maxLikedCount = 20

    users.map((user) => {
      const likedCount = Math.floor(Math.random() * maxLikedCount)
      const tweetsShuffle = shuffle(tweets).splice(0, likedCount)
      const tweetMap = tweetsShuffle.map((tweet) => ({
        user_id: user.id,
        tweet_id: tweet.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      likes.push(...tweetMap)
    })
    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
