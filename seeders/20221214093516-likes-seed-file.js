'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 預設每個使用者給10篇tweets Like
    const likesPerUser = 10
    // 從資料庫取得所有user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 從資料庫取得所有tweet
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 所有使用者Like數總和
    const totalLikes = (users.length - 1) * likesPerUser

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: totalLikes }, (_, index) =>
        (
          {
            User_id: users[Math.floor(index / likesPerUser) + 1].id,
            Tweet_id: tweets[Math.floor(Math.random() * tweets.length)].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        )), {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
}
