'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    function randomNum (num) {
      return Math.floor(Math.random() * num) + 1
    }
    const followships = []
    users.forEach((user, i) => {
      const followingId = user.id
      const followersNums = randomNum(8) // 隨機選擇追蹤人數(1~8人)
      const others = Array.from(users)
      others.splice(i, 1)
      for (let n = 0; n < followersNums; n++) {
        const followerIndex = randomNum(others.length) - 1
        followships.push({
          followingId,
          followerId: others[followerIndex].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        others.splice(followerIndex, 1)
      }
    })
    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
