'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const notices = users.map(user => ({
      userId: user.id,
      newNotice: null,
      noticeRead: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('Notices', notices)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notices', {})
  }
}
