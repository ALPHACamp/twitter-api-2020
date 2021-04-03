'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeReplies = []
    let replyId = 1
    let johnnyId = 1
    let count = 0
    for (let i = 1; i < 1492; i += 10) { //150 tweets
      for (let j = 0; j < 3; j++) { // 3 replies per tweet
        fakeReplies.push({
          id: count === 0 ? 1 : replyId += 10,
          UserId: Math.floor((Math.random()) * 5) * 10 + 11,
          TweetId: i,
          comment: `Johnny, You also did a good job organizing everything! thx to you!!! Such a rigorous person! ReplyId: ${count === 0 ? 1 : johnnyId += 10}`,
          createdAT: new Date(),
          updatedAt: new Date()
        })
        count++
      }
    }

    await queryInterface.bulkInsert('Replies', fakeReplies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
