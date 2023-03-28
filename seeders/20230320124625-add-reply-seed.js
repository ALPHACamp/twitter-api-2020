'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // - 條件一 : 每個一般使用者有 1 則 reply
    // - 條件二 : 每篇 tweet 有 3 則 replies
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const userCount = {}
    const tweetCount = {}
    const replies = genReplies(users, tweets)
    await queryInterface.bulkInsert('Replies', replies, {})

    function genReplies (users, tweets) {
      const result = []
      let count = 0
      // - 每篇 tweet 留言需要有 3 則
      while (count < tweets.length * 3) {
        const userIndex = genRandomUserIndex(users.length)
        const tweetIndex = genRandomTweetIndex(tweets.length)
        const reply = {
          comment: faker.lorem.lines(),
          UserId: users[userIndex].id,
          TweetId: tweets[tweetIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        result.push(reply)
        count += 1
      }
      return result
    }

    function genRandomUserIndex (length) {
      const randomIndex = Math.floor(Math.random() * length)
      if (!checkUserCount(users[randomIndex].id)) {
        return genRandomUserIndex(length) // - 重新產生
      }
      return randomIndex
    }

    function genRandomTweetIndex (length) {
      const randomIndex = Math.floor(Math.random() * length)
      if (!checkTweetCount(tweets[randomIndex].id)) {
        return genRandomTweetIndex(length) // - 重新產生
      }
      return randomIndex
    }

    function checkUserCount (UserId) {
      // - 檢查挑選到的 user 是否已留過言
      if (!userCount[UserId]) {
        userCount[UserId] = 1
        return true
      }
      // - 若挑選到的 user 已留過言，檢查是否已經滿足 5 位都有留言
      if (Object.keys(userCount).length < 5) return false
      userCount[UserId] += 1
      return true
    }

    function checkTweetCount (TweetId) {
      // - 檢查挑選到的 tweet 是否存在留言
      if (!tweetCount[TweetId]) {
        tweetCount[TweetId] = 1
        return true
      }
      // - 若挑選到的 tweet 已存在留言，是否已經有 3 筆
      if (tweetCount[TweetId] === 3) return false
      tweetCount[TweetId] += 1
      return true
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
