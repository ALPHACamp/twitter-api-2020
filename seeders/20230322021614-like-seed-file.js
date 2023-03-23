'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Likes', Array.from({ length: 250 }, (_, index) => ({
      createdAt: new Date(),
      updatedAt: new Date(),
      TweetId: tweets[index % 50].id,
      UserId: users[index % 5].id
    })))
    // await queryInterface.sequelize.query(
    // 	`DELETE likes FROM likes
    // 	 INNER JOIN tweets ON likes.tweetId = tweets.id
    // 	 WHERE likes.UserId = tweets.UserId
    // 	 AND likes.UserId <> tweets.UserId`,
    // 	{ type: Sequelize.QueryTypes.DELETE }
    // );
  },
  // !這邊還沒有解決不能Like自己貼文的問題
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
