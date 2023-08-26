'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const uniqueFollowships = new Set()
    const followships = []

    while (uniqueFollowships.size < 30) {
      const followerId = users[Math.floor(Math.random() * users.length)].id
      let followingId

      do {
        followingId = users[Math.floor(Math.random() * users.length)].id
      } while (followerId === followingId)

      const combination = `${followerId}-${followingId}`

      if (!uniqueFollowships.has(combination)) {
        uniqueFollowships.add(combination)
        followships.push({
          follower_id: followerId,
          following_Id: followingId,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
}
