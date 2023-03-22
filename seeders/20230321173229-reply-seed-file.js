'use strict'
const { User, Tweet } = require('../models')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweetData = await Tweet.findAndCountAll()
    const userIdData = await User.findAll({ attributes: ['id'], raw: true })

    // 先列出所有reply對應到的tweetId，陣列元素數量: 3 * tweetData.count
    const replySeedData = Array.from({ length: 3 * tweetData.count }).map((_, i) => {
      const tweetId = tweetData.rows[Math.floor(i / 3)].dataValues.id
      return {
        tweet_id: tweetId,
        comment: faker.lorem.paragraph(),
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // 雙重迴圈，跑出三個不重複userId，然後以此跑 tweetData.count 次
    const randomUserPickArr = []
    for (let i = 0; i < tweetData.count; i++) {
      const randomUserPick = userIdData.map(user => user.id)
      for (let j = 0; j < 3; j++) {
        randomUserPickArr.push(randomUserPick.splice(Math.floor(Math.random() * randomUserPick.length), 1)[0])
      }
    }

    // 將上述兩個陣列的資料合併
    const combineData = replySeedData.map((item, i) => ({ ...item, user_id: randomUserPickArr[i] }))

    await queryInterface.bulkInsert('Replies', combineData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies')
  }
}
