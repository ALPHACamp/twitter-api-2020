'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Followships', Array.from({ length: 20 }, (_, index) => ({
      createdAt: new Date(),
      updatedAt: new Date(),
      followingId: users[4 - index % 5].id,
      followerId: users[index % 5].id
    })))
    await queryInterface.sequelize.query('DELETE FROM followships WHERE followingId = followerId;', { type: queryInterface.sequelize.QueryTypes.DELETE })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
