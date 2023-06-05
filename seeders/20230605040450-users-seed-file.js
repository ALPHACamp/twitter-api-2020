"use strict";
const bcrypt = require("bcryptjs");
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //create 6 users, only root is admin
    const users = [];
    users.push({
      account: "root",
      password: await bcrypt.hash("12345678", 10),
      name: "root",
      email: "root@example.com",
      avatar: `https://loremflickr.com/320/240/man/?random=${
        Math.random() * 100
      }`,
      cover: `https://loremflickr.com/1440/480/city/?random=${
        Math.random() * 100
      }`,
      introduction: faker.lorem.text().substring(0, 100),
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    });
    for (let i = 1; i <= 5; i++) {
      users.push({
        account: "user" + i,
        password: await bcrypt.hash("12345678", 10),
        name: "user" + i,
        email: "user" + i + "@example.com",
        avatar: `https://loremflickr.com/320/240/man/?random=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/1440/480/city/?random=${
          Math.random() * 100
        }`,
        introduction: faker.lorem.text().substring(0, 100),
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("Users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
