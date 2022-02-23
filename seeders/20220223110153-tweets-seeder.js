'use strict'

const faker = require('faker')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const DEFAULT_TWEET_NUMBER = 10
    // 獲取現存資料庫使用者(不含管理員)
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 更新資料庫上使用者所擁有的推文數
    await Promise.all(seedUsers.map(userId => queryInterface.sequelize.query(
      `
          UPDATE Users SET tweet_count = 10
          WHERE id = ${userId}
      `
    )))


    // 資料庫中的每個使用者都擁有10篇推文
    seedUsers.forEach(async userId => {
      const seederArray = Array.from({ length: DEFAULT_TWEET_NUMBER }, () => {
        return {
          user_id: userId,
          description: faker.lorem.text().substring(0, 140),
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      await queryInterface.bulkInsert('Tweets', seederArray)
    })



  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role="user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 更新資料庫上使用者所擁有的推文數
    seedUsers.forEach(async userId => {
      const queryStatement = `
          UPDATE Users SET tweet_count = 0
          WHERE id = ${userId}
      `

      await queryInterface.sequelize.query(queryStatement)
    })

    await queryInterface.bulkDelete('Tweets', null)

  }
}
