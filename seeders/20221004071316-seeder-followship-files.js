'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const FOLLOWERS_PER_USER = 3
    const DEFAULT_RANDOM_NUM = 0
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followships = []

    users.forEach(user => {
      const userArr = []
      followships.push(
        ...Array.from({ length: FOLLOWERS_PER_USER }, () => {
          let followingId = DEFAULT_RANDOM_NUM
          do {
            followingId = users[Math.floor(Math.random() * users.length)].id
          } while (followingId === user.id || userArr.includes(followingId))
          userArr.push(followingId)
          return {
            followerId: user.id,
            followingId,
            createdAt: faker.date.between('2022-09-01T00:00:00.000Z', '2022-10-01T00:00:00.000Z'),
            updatedAt: new Date()
          }
        }))
    })
    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
