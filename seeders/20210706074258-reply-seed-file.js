'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let replies = []
    const TWEET_NUM = 50
    const REPLY_PER_POST = 3
    const TOTAL_USER = 5

    // 1-50
    const tweets = Array.from({ length: TWEET_NUM }).map((item, i) => ({
      id: i + 1
    }))

    const userPool = Array.from({ length: TOTAL_USER }).map((_, index) => index + 1)

    tweets.forEach((tweet, tweetIndex) => {
      const userRandomPool = unrepeatedArray(REPLY_PER_POST, userPool)

      const tempReplies = Array.from({ length: REPLY_PER_POST }).map((reply, replyIndex) => ({
        id: tweetIndex * REPLY_PER_POST + (replyIndex + 1),
        UserId: userRandomPool[replyIndex],
        TweetId: tweet.id,
        comment: faker.lorem.sentence(139),
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      replies = replies.concat(tempReplies)
    })

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};

// 取不重複元素
function unrepeatedArray(indexNeed, array) {
  const tempArr = [...array]
  let result = []

  for (let i = 0; i < indexNeed; i++) {
    const randomIndex = ~~(Math.random() * tempArr.length)
    const choice = tempArr[randomIndex]

    result.push(choice)

    tempArr[randomIndex] = tempArr[tempArr.length - 1]
    tempArr[tempArr.length - 1] = choice

    tempArr.pop()
  }

  return result
}