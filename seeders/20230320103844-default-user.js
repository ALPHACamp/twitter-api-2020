"use strict";
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // - 一個 admin 和 9 個一般用戶
    await queryInterface.bulkInsert(
      "Users",
      Array.from({ length: 15 }, (_, index) =>
        index === 0
          ? {
              name: "root",
              email: "root@example.com",
              account: "root",
              password: bcrypt.hashSync("12345678", 10),
              isAdmin: true,
              role: "admin",
              avatar: faker.image.avatar(),
              cover: faker.image.nature(640, 480, true),
              introduction: faker.lorem.paragraph(4),
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : {
              name: `user${index}`,
              email: `user${index}@example.com`,
              account: `user${index}`,
              password: bcrypt.hashSync("12345678", 10),
              isAdmin: false,
              role: "user",
              avatar: faker.image.avatar(),
              cover: faker.image.nature(640, 480, true),
              introduction: faker.lorem.paragraph(4),
              createdAt: new Date(),
              updatedAt: new Date(),
            }
      ),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
