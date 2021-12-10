'use strict';
// 載入所需套件
const { User, Tweet } = require('../models')
const { Op } = require('sequelize')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出目前資料庫所有使用者的id(不包含admin的id)，及所有推文的id
    const tweets = await Tweet.findAll({ attributes: ['id'] })
    const users = await User.findAll({ where: { [Op.not]: [{ role: 'admin' }] }, attributes: ['id'] })

    // 將使用者的id放進陣列中
    let userIdList = []
    for (const user of users) { userIdList.push(user.id) }

    // 將推文的id放進陣列中
    let tweetIdList = []
    for (const tweet of tweets) { tweetIdList.push(tweet.id) }

    // 將產生的reply放進replies的陣列中
    let replies = []
    for (const tweetId of tweetIdList) {
      let index = Math.floor(Math.random() * userIdList.length)
      for (let i = 0; i < 3; i++) {
        index = index + i > (userIdList.length - 1) ? 0 : index + i // 確保3個留言者是不同人
        let data = new Object()
        data.comment = faker.lorem.text().substring(0, 140)
        data.UserId = userIdList[index]
        data.TweetId = tweetId
        data.createdAt = new Date()
        data.updatedAt = new Date()
        replies.push(data)
      }
    }

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
