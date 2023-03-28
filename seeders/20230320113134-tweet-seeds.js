"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // - 查詢一般使用者
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const tweets = [];
    // - 每個一般使用者有 10 篇 tweets
    for (let i = 0; i < users.length; i += 1) {
      tweets.push(
        ...Array.from({ length: 10 }, () => ({
          description: faker.lorem.lines(),
          UserId: users[i].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }
    await queryInterface.bulkInsert("Tweets", tweets, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tweets", null, {});
  },
};
