'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedFollowships = []
    for (let i = 0; i < usersId.length * (usersId.length - 1); i++) {
      const copiedUsersId = usersId.slice()
      const followingId = copiedUsersId.filter(user => user.id !== usersId[Math.floor(i / (usersId.length - 1))].id)
      seedFollowships.push({
        follower_id: usersId[Math.floor(i / (usersId.length - 1))].id,
        following_id: followingId[i % (usersId.length - 1)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Followships', seedFollowships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
