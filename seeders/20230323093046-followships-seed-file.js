'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Users 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = 0;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 所有 users 互相 follow
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: users.length * (users.length - 1) }, (_, i) => ({
        follower_id: users[i % users.length].id,
        following_id: users
          .filter((_, idx) =>
            idx !== (i % users.length))[
            Math.floor(i / users.length)
          ].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
