'use strict';
const bcrypt = require("bcrypt-nodejs");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = Array.from({ length: 5 }).map((user, i) => ({
      id: i + 1,
      account: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
      name: faker.name.findName(),
      avatar: "https://loremflickr.com/g/320/240/girl/all",
      cover: "https://loremflickr.com/800/600/dog",
      bio: faker.lorem.text(100),
      createdAt: new Date(),
      updatedAt: new Date(),
      likeNum: 0,
      tweetNum: 10,
      followingNum: 0,
      followerNum: 0,
      lastLoginAt: new Date()
    }))
    await queryInterface.bulkInsert("Users", data, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
