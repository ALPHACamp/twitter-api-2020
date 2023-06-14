// 'use strict'

// const faker = require('faker')
// const fixFunction = (index, array, followerId, defaultCount) => {
//   const remind = index % defaultCount
//   const newArray = array.filter(a => a.id !== followerId)
//   const { id } = newArray[remind]
//   return id
// }
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const users = await queryInterface.sequelize.query(
//       "SELECT id FROM Users WHERE role = 'user';",
//       { type: queryInterface.sequelize.QueryTypes.SELECT }
//     )
//     const DEFAULT_EACH_USER_FOLLOWS = users.length - 1
//     const totalFollows = users.length * DEFAULT_EACH_USER_FOLLOWS
//     await queryInterface.bulkInsert('Followships',
//       Array.from({ length: totalFollows }, (_, index) => {
//         const followerId = users[Math.floor(index / DEFAULT_EACH_USER_FOLLOWS)].id
//         const followingId = fixFunction(index, users, followerId, DEFAULT_EACH_USER_FOLLOWS)
//         return {
//           followerId,
//           followingId,
//           createdAt: faker.date.past(),
//           updatedAt: faker.date.recent()
//         }
//       })
//     )
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Followships', {})
//   }
// }

'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const DEFAULT_EACH_USER_FOLLOWS = 2 || users.length - 1
    const totalFollows = users.length * DEFAULT_EACH_USER_FOLLOWS
    let userArray = users
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: totalFollows }, (_, index) => {
        const remind = index % DEFAULT_EACH_USER_FOLLOWS
        const followerId = users[Math.floor(index / DEFAULT_EACH_USER_FOLLOWS)].id
        if (remind === 0) userArray = users
        userArray = userArray.filter(a => a.id !== followerId)
        const followingId = userArray[Math.floor(Math.random() * userArray.length)].id
        userArray = userArray.filter(a => a.id !== followingId)
        return {
          followerId,
          followingId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
