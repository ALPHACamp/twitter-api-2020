'use strict'
const { Op } = require('sequelize')
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users1 = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users2 = await User.findAll({ where: { [Op.not]: [{ role: 'admin' }] }, attributes: ['id'] })
    let userIdList = []
    for (const user of users2) { userIdList.push(user.id) }

    await queryInterface.bulkInsert('Followships',
      users1.flatMap(user => {
        const newIdList = userIdList.filter(id => id !== user.id)
        return Array.from({ length: Math.floor(Math.random() * userIdList.length) - 1 }).map((v, i) => ({
          followerId: newIdList[i],
          followingId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      }), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
