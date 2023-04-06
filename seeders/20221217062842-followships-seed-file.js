'use strict'
const FOLLOWINGS_PER_USER = 5

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIdArr = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followships = []
    usersIdArr.forEach(userIdObj => {
      const usersIdCheckRepeatArr = []
      let followingId
      followships.push(
        ...Array.from({ length: FOLLOWINGS_PER_USER }).map(() => {
          do {
            followingId = usersIdArr[Math.floor(Math.random() * usersIdArr.length)].id
          } while (followingId === userIdObj.id || usersIdCheckRepeatArr.includes(followingId))
          usersIdCheckRepeatArr.push(followingId)
          return ({
            followerId: userIdObj.id,
            followingId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
        ))
    })

    await queryInterface.bulkInsert('Followships', followships, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
