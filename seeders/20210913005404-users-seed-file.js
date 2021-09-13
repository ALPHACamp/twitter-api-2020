'use strict';

const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        name: "root",
        email: "root@example.com",
        account: "root",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: "user1",
        email: "user1@example.com",
        account: "User1",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?man/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 21,
        name: "user2",
        email: "user2@example.com",
        account: "User2",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?man/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 31,
        name: "user3",
        email: "user3@example.com",
        account: "User3",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?man/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 41,
        name: "user4",
        email: "user4@example.com",
        account: "User4",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?man/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 51,
        name: "user5",
        email: "user5@example.com",
        account: "User5",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?man/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 61,
        name: "user6",
        email: "user6@example.com",
        account: "User6",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 71,
        name: "user7",
        email: "user7@example.com",
        account: "User7",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 81,
        name: "user8",
        email: "user8@example.com",
        account: "User8",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 91,
        name: "user9",
        email: "user9@example.com",
        account: "User9",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 101,
        name: "user10",
        email: "user10@example.com",
        account: "User10",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        role: "user",
        introduction: faker.lorem.paragraph(3),
        avatar: `https://source.unsplash.com/1600x1200/?woman/?random=${
          Math.random() * 100
        }`,
        cover: `https://source.unsplash.com/1600x900/?nature/?random=${
          Math.random() * 100
        }`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
