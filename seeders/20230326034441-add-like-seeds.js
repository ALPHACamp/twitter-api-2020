'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE account <> 'root'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const tweets = await queryInterface.sequelize.query(
      "SELECT id FROM Tweets",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const likes = [];
    // - 每人隨機喜歡 5 篇推文
    users.forEach((_, index) => {
      let temp = [...tweets] // - 複製一份 tweets
      for(let i = 0; i < 5; i += 1) {
        const randomIndex = Math.floor(Math.random() * temp.length);
        const like = {
          UserId: users[index].id,
          TweetId: temp[randomIndex].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        likes.push(like);
        temp.splice(randomIndex, 1) // - 移除選中的 tweet
      }
    });
    await queryInterface.bulkInsert("Likes", likes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
