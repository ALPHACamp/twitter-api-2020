'use strict'
const { generateRandomNumArr } = require('../helpers/random-generate-helper')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const FOLLOWSHIPS_NUMBER = 10
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE `role` <> 'admin'", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: FOLLOWSHIPS_NUMBER }, (_, i) => {
        const randomUsers = generateRandomNumArr(users.length, 2)
        return {
          followerId: users[randomUsers[0]].id,
          followingId: users[randomUsers[1]].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }),
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
