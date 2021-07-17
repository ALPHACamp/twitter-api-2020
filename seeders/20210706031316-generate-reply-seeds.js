'use strict';

const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];
    let index = 0;
    Array.from({ length: 5 }).map((user, i) => {
      for (let j = 0; j < 10; ++j) {
        data.push(...Array.from({ length: 3 }).map((reply) => ({
          id: ++index,
          TweetId: j * 10 + i + 1,
          UserId: Math.floor(Math.random() * 5 + 1),
          comment: faker.lorem.text(140),
          createdAt: new Date(),
          updatedAt: new Date()
        })))
      }
    })
    await queryInterface.bulkInsert("Replies", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Replies", null, {});
  }
};
