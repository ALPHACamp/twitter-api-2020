'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tweetId = ''
    for (let i = 1; i < 51; i++) {
      tweetId += (String(i) + ',').repeat(2)
    }
    const tweetIdArray = tweetId.split(',')
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 100 }).map((d, i) => ({
        UserId: Math.floor(Math.random() * 5) + 2,
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
