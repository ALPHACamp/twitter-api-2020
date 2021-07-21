'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let replyId = ''
    for (let i = 1; i < 300; i = i + 2) {
      replyId += (String(i * 5) + ',').repeat(2)
    }
    const replyIdArray = replyId.split(',')
    replyIdArray.splice(-1, 1)
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 300 }).map((d, i) => ({
        UserId: Math.floor(Math.random() * 6) * 10 + 5,
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
