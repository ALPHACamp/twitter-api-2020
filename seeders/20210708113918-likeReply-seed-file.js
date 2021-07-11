'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let replyId = ''
    for (let i = 5; i <= 750; i = i + 5) {
      replyId += (String(i) + ',').repeat(2)
    }
    const replyIdArray = replyId.split(',')
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 300 }).map((d, i) => ({
        UserId: (Math.floor(Math.random() * 5) + 2) * 5,
        ReplyId: replyIdArray[i],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});
  }
};
