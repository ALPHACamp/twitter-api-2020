'use strict';
// 載入所需套件
const { User, Tweet } = require('../models')
const { Op } = require('sequelize')

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

    // 將產生的like放進likes的陣列中
    let likes = []
    for (let tweetId of tweetIdList) {
      let index = Math.floor(Math.random() * userIdList.length) // 每篇貼文的喜歡數不同
      for (let i = 0; i < index; i++) {
        index = index + 1 > (userIdList.length - 1) ? 0 : index + 1 // 確保同個人不會按兩次喜歡
        let data = new Object()
        data.UserId = userIdList[index]
        data.TweetId = tweetId
        data.createdAt = new Date()
        data.updatedAt = new Date()
        likes.push(data)
      }
    }

    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
