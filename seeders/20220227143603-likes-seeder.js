'use strict'
const { DEFAULT_LIKER_NUMBER } = require('../config/seeder')
const { randomTime } = require('../helpers/random-time-generator')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    // 在同篇推文上，每個喜歡的人皆不是同一個人
    // 在同篇推文上，每個留言者只會有一個喜歡
    // 在同篇推文上，有三名喜歡這篇文章的人 (DEFAULT_LIKER_NUMBER = 3)
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    const seedTweets = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Tweets`', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 先建立一串預備要更新至Likes表格的留言紀錄，每個喜歡推文的人皆為不一樣
    const seederArray = []
    // 紀錄使用者喜歡數
    const userLikeCounts = {}
    seedTweets.forEach(tweetId => {

      const userList = {}
      while (true) {
        const userId = Math.floor(Math.random() * seedUsers.length)

        userList[`${userId}`] = true
        if (Object.keys(userList).length === DEFAULT_LIKER_NUMBER) {
          break
        }
      }

      const result = Object.keys(userList).map(index => seedUsers[index])
      result.forEach(userId => {

        userLikeCounts[userId] = userLikeCounts[userId] ?
          ++userLikeCounts[userId] :
          1

        seederArray.push({
          TweetId: tweetId,
          UserId: userId,
          createdAt: randomTime(),
          updatedAt: new Date()
        })
      })

    })

    // 更新使用者的喜歡數
    await Promise.all(
      Object.entries(userLikeCounts).map(([key, value]) => {
        const queryStatement = `
          UPDATE Users SET likeCount = ${value}
          WHERE id = ${key}
        `
        return queryInterface.sequelize.query(queryStatement)
      })
    )

    // 更新資料庫上推文所擁有的喜歡數
    await Promise.all(seedTweets.map(tweetId => queryInterface.sequelize.query(
      `
          UPDATE Tweets SET likeCount = 3
          WHERE id = ${tweetId}
      `
    )))

    // 實際更新使用者對於推文的留言
    await queryInterface.bulkInsert('Likes', seederArray)
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    const seedTweets = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Tweets`', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 重設每個推文的喜歡數為0
    seedTweets.forEach(async tweetId => {
      const queryStatement = `
          UPDATE Tweets SET likeCount = 0
          WHERE id = ${tweetId}
      `
      await queryInterface.sequelize.query(queryStatement)
    })

    // 重設每個使用者的喜歡數為0
    seedUsers.forEach(async userId => {
      const queryStatement = `
          UPDATE Users SET likeCount = 0
          WHERE id = ${userId}
      `

      await queryInterface.sequelize.query(queryStatement)
    })

    // 刪除Likes所有紀錄
    await queryInterface.bulkDelete('Likes', null)
  }
}
