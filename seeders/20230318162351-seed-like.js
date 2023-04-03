'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role <> "admin"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetsId = await queryInterface.sequelize.query(
      'SELECT id FROM tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 50 }, (_, i) => {
        return {
          User_id: usersId[Math.floor(Math.random() * usersId.length)].id,
          Tweet_id: tweetsId[Math.floor(Math.random() * tweetsId.length)].id,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
