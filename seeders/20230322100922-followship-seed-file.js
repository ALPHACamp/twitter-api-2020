'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取使用者id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 每名使用者
    for (const user of users) {
      const followships = []
      // 追蹤3名其他使用者
      for (let i = 0; i < 3; i++) {
        // 以do-while確保使用者不同
        let randomUserId
        do {
          randomUserId = users[Math.floor(Math.random() * users.length)].id
        } while (randomUserId === user.id || followships.some(followship => followship.followingId === randomUserId)) // 若已存在則再次隨機
        followships.push({
          followerId: user.id,
          followingId: randomUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      // 建立追蹤
      await queryInterface.bulkInsert('Followships', followships)
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
