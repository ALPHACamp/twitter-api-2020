'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // find user id first and exclude admin account
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const rooms = [{
      userOneId: null,
      userTwoId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    users.forEach(user => {
      const excludeSelfUsers = users.filter(u => u.id !== user.id)
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * excludeSelfUsers.length)
        rooms.push({
          userOneId: user.id,
          userTwoId: excludeSelfUsers[randomIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        // avoid to follow same user
        excludeSelfUsers.splice(randomIndex, 1)
      }
    })
    await queryInterface.bulkInsert('Rooms', rooms)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rooms', {})
  }
}
