'use strict';
// 載入所需套件
const { User } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出目前資料庫所有使用者的id(不包含admin的id)
    const users = await User.findAll({ where: { [Op.not]: [{ role: 'admin' }] }, attributes: ['id'] })

    // 將使用者的id放進陣列中
    let userIdList = []
    for (const user of users) { userIdList.push(user.id) }

    // 將產生的followship放進followships的陣列中
    let followships = []
    for (const userId of userIdList) {
      const newIdList = userIdList.filter(id => id !== userId) // 回傳一個新陣列(去除自己的id，才不會自己追蹤自己)
      let index = Math.floor(Math.random() * newIdList.length) // 每個使用者追蹤不同人數(最大是追蹤除了自己以外其他所有人)
      for (let i = 0; i < index; i++) {
        index = index + 1 > newIdList.length - 1 ? 0 : index + 1 // 確保不會追蹤同一人兩次
        let data = new Object()
        data.followerId = userId
        data.followingId = newIdList[index]
        data.createdAt = new Date()
        data.updatedAt = new Date()
        followships.push(data)
      }
    }

    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
