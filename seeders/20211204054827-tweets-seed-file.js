'use strict';
// 載入所需套件
const faker = require('faker')
const { User } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出目前資料庫使用者的id(不包含admin的id)
    const users = await User.findAll({ where: { [Op.not]: [{ role: 'admin' }] }, attributes: ['id'] })

    // 將使用者的id放進陣列中
    let userIdList = []
    for (const user of users) { userIdList.push(user.id) }

    // 將產生的tweet放進tweets的陣列中
    let tweets = []
    for (const userId of userIdList) {
      for (let i = 0; i < 10; i++) {
        const data = new Object()
        data.description = faker.lorem.text().substring(0, 140)
        data.UserId = userId
        data.createdAt = new Date()
        data.updatedAt = new Date()
        tweets.push(data)
      }
    }

    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
