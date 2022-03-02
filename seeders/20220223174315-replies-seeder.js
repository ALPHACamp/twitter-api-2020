'use strict'
const faker = require('faker')
const { randomTime } = require('../helpers/random-time-generator')
const { DEFAULT_REPLIER_NUMBER } = require('../config/seeder')
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
    // 在同篇推文上，每個留言者皆不是同一個人
    // 在同篇推文上，每個留言者只會有一則留言
    // 在同篇推文上，有三名留言者 (DEFAULT_REPLIER_NUMBER = 3)
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    const seedTweets = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Tweets`', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 先建立一串預備要更新至Replies表格的留言紀錄，每個留言者皆為不一樣
    const seederArray = []

    seedTweets.forEach(tweetId => {

      const userList = {}
      while (true) {
        const userId = Math.floor(Math.random() * seedUsers.length)

        userList[`${userId}`] = true
        if (Object.keys(userList).length === DEFAULT_REPLIER_NUMBER) {
          break
        }
      }

      const result = Object.keys(userList).map(index => seedUsers[index])

      result.forEach(userId => {
        seederArray.push({
          TweetId: tweetId,
          UserId: userId,
          comment: faker.lorem.text().substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })

    })

    // 更新資料庫上推文所擁有的留言數
    await Promise.all(seedTweets.map(tweetId => queryInterface.sequelize.query(
      `
          UPDATE Tweets SET replyCount = 3
          WHERE id = ${tweetId}
      `
    )))

    // 實際更新使用者對於推文的留言
    await queryInterface.bulkInsert('Replies', seederArray)
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    const seedTweets = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Tweets`', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 重設每個推文的留言數為0
    seedTweets.forEach(async tweetId => {
      const queryStatement = `
          UPDATE Tweets SET replyCount = 0
          WHERE id = ${tweetId}
      `

      await queryInterface.sequelize.query(queryStatement)
    })

    // 刪除Replies所有紀錄
    await queryInterface.bulkDelete('Replies', null)

  }
}
