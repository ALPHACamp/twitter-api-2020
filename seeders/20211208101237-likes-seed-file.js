'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Likes', 
      Array.from({ length: 100 }).map((d, i) => ({
        TweetId: Math.ceil(Math.random()*49) * 10 + 1,  // [1,11,..491]
        UserId: (i % 5) * 10 + 1,  // [1,11,21,31,41] ; i = 1~50; i % 5 = 0~4
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
};
