'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tweetId = ''
    for (let i = 1; i < 100; i = i + 2) {
      tweetId += (String(i * 5) + ',').repeat(2)
    }
    const tweetIdArray = tweetId.split(',')
    tweetIdArray.splice(-1, 1)
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 100 }).map((d, i) => ({
        UserId: Math.floor(Math.random() * 6) * 10 + 5,
        TweetId: tweetIdArray[i],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});
  }
};
