'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Users 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    let targetArr = []
    // 讓每個 user 的 follow 數不同 (遞減)
    for (let j = 0; j < users.length; j++) {
      targetArr = targetArr.concat(
        Array.from({ length: users.length - j - 1 }, (_, i) => ({
          follower_id: users[j].id,
          following_id: users
            .filter((_, idx) => idx !== j)[i].id,
          is_notified: true,
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    }
    await queryInterface.bulkInsert('Followships', targetArr
    // ? 舊版本~~~~~~~~~~~
    // 所有 users 互相 follow
      // Array.from({ length: users.length * (users.length - 1) }, (_, i) => ({
      //   follower_id: users[i % users.length].id,
      //   following_id: users
      //     .filter((_, idx) =>
      //       idx !== (i % users.length))[
      //       Math.floor(i / users.length)
      //     ].id,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // }))
      // ? 舊版本 end~~~~~~~~~~~~~~~
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
