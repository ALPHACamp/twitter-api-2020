'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Followships = []
    // 引入user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE account <> "root"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const user1 = users.slice(1, users.length) // 把自己排除在外
    const user2 = user1.slice(1, user1.length)
    const user3 = user2.slice(1, user2.length)
    const user4 = user3.slice(1, user3.length)
    const user5 = user4.slice(1, user4.length)
    const user6 = user5.slice(1, user5.length)
    const user7 = user6.slice(1, user6.length)

    // 因為有root 他的id 是第一位，所以要排除第一位 後面的被追蹤要放如當下使用者的id
    // 後面用迭代方法 放入其他使用者的id
    user1.map(user => (
      Followships.push({
        following_id: users[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user2.map(user => (
      Followships.push({
        following_id: user1[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user3.map(user => (
      Followships.push({
        following_id: user2[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user4.map(user => (
      Followships.push({
        following_id: user3[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user5.map(user => (
      Followships.push({
        following_id: user4[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user6.map(user => (
      Followships.push({
        following_id: user5[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    user7.map(user => (
      Followships.push({
        following_id: user6[0].id,
        follower_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )

    await queryInterface.bulkInsert('Followships', Followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
