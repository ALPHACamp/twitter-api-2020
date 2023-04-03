'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role <> "admin"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    for (let i = 0; i < 4; i++) {
      await queryInterface.bulkInsert(
        'Followships',
        usersId.map((e, i) => {
          let random = Math.floor(Math.random() * usersId.length)
          while (random === i) {
            random = Math.floor(Math.random() * usersId.length)
          }
          return {
            follower_id: e.id,
            following_id: usersId[random].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
