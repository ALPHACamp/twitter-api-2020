'use strict'

const { User, Sequelize } = require('../models')
const { Op } = Sequelize

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIdList = (await User.findAll({ attributes: ['id'], raw: true, where: { role: { [Op.not]: 'admin' } } }))

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 }, (v, i) => ({
        followerId: userIdList[i].id,
        followingId: userIdList[(i + 1) % 5].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, { truncate: true })
  }
}
