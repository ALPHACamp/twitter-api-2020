'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // find user id first and exclude admin account
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []
    // Each user randomly follows 2 users
    const numOfFollowing = 5
    users.forEach(user => {
      // avoid to follow self
      const excludeSelfUsers = users.filter(u => u.id !== user.id)

      for (let i = 0; i < numOfFollowing; i++) {
        const randomIndex = Math.floor(Math.random() * excludeSelfUsers.length)
        followships.push({
          followerId: user.id,
          followingId: excludeSelfUsers[randomIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        // avoid to follow same user
        excludeSelfUsers.splice(randomIndex, 1)
      }
    })
    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
