'use strict'

/* 
跟隨者seeder 演算法如下，主要負責產生亂數的被跟隨數：
1. 目前使用者設定為20位，每一個人只能跟隨5個人
2. 每一個人只能選前面十位使用者
3. 若自己就選到自己，那麼即可跳過直到改選到非自己以外的使用者，且能跟隨範圍還是前面十位
*/
const {
  FOLLOWING_CANDIDATE_RANGE,
  DEFAULT_FOLLOWING_NUMBER
} = require('../config/seeder')
const { sequelize } = require('../models')

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


    // 先獲取所有使用者
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 產生一筆SQL 指令來負責更新followship表格的資料和followerCount計算

    // 先建立一串預備要更新至Followship表格的跟隨紀錄
    const seederArray = []

    // 紀錄使用者喜歡數
    const userFollowerCounts = {}

    // 確定跟隨範圍
    const { START, END } = FOLLOWING_CANDIDATE_RANGE
    seedUsers.forEach(userId => {

      const followingList = {}

      while (true) {
        const followingId = Math.floor(Math.random() * END) + START

        if (seedUsers[followingId] !== userId) followingList[`${followingId}`] = true
        if (Object.keys(followingList).length === DEFAULT_FOLLOWING_NUMBER) {
          break
        }
      }

      const result = Object.keys(followingList).map(index => seedUsers[index])
      console.log('data: ', userId, result)
      result.forEach(followingId => {

        userFollowerCounts[followingId] = userFollowerCounts[followingId] ?
          ++userFollowerCounts[followingId] :
          1

        seederArray.push({
          followerId: userId,
          followingId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })

    })

    // 更新每一位使用者的followingCount 為 5 (DEFAULT_FOLLOWING_NUMBER = 5)
    await Promise.all(seedUsers.map(userId => queryInterface.sequelize.query(
      `
          UPDATE Users SET followingCount = ${DEFAULT_FOLLOWING_NUMBER}
          WHERE id = ${userId}
      `
    )))


    // 更新每一位使用者followerCount
    await Promise.all(
      Object.entries(userFollowerCounts).map(([key, value]) => {
        const queryStatement = `
          UPDATE Users SET followerCount = ${value}
          WHERE id = ${key}
        `
        return queryInterface.sequelize.query(queryStatement)
      })
    )

    // 實際執行SQL指令來增加跟隨紀錄
    await queryInterface.bulkInsert('Followships', seederArray)
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    // 先獲取所有使用者
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE role = "user"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })).map(item => item.id)

    // 更新每一位使用者的followingCount 為 0
    // 更新每一位使用者followerCount 為 0
    await Promise.all(seedUsers.map(userId => queryInterface.sequelize.query(
      `
          UPDATE Users SET followingCount = 0, followerCount = 0
          WHERE id = ${userId}
      `
    )))

    // 清除掉Followship表格下的所有資料
    await queryInterface.bulkDelete('Followships', null)
  }
}
