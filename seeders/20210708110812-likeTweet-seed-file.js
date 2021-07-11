'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tweetId = ''
    for (let i = 5; i <= 250; i = i + 5) {
      tweetId += (String(i) + ',').repeat(3)
    }
    const tweetIdArray = tweetId.split(',')
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 100 }).map((d, i) => ({
        UserId: (Math.floor(Math.random() * 5) + 2) * 5,
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
