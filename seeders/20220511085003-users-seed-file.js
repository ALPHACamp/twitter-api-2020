'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 新增 Admin 資料
          account: 'root',
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'admin',
          avatar: 'https://i.pinimg.com/564x/16/85/b6/1685b6e6dd61477e744e02ea663b275e.jpg',
          cover: 'https://cdn.pixabay.com/photo/2020/04/19/21/25/field-5065671__340.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // 新增五筆使用者種子資料
          account: 'user1',
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://pbs.twimg.com/profile_images/1490735661409832963/MdjPf5jL_400x400.jpg',
          cover: 'https://cdn.pixabay.com/photo/2017/04/11/15/55/animals-2222007__480.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user2',
          name: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://pbs.twimg.com/profile_images/1133109643734130688/BwioAwkz_400x400.jpg',
          cover: 'https://cdn.pixabay.com/photo/2020/07/23/10/51/field-5431007__480.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user3',
          name: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://pbs.twimg.com/profile_images/1519464543189098496/cs7M4CiQ_400x400.jpg',
          cover: 'https://cdn.pixabay.com/photo/2017/10/03/17/53/nature-2813487__480.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user4',
          name: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://pbs.twimg.com/profile_images/1383196364792680448/N8CdupEu_400x400.jpg',
          cover: 'https://cdn.pixabay.com/photo/2017/07/23/16/01/nature-2531761__480.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: 'user5',
          name: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          role: '',
          avatar: 'https://i.pinimg.com/564x/ac/44/37/ac4437b90bac3628fa9e0406c660a36a.jpg',
          cover: 'https://cdn.pixabay.com/photo/2019/05/03/18/36/nature-4176575__480.jpg',
          introduction: faker.lorem.text().substring(0, 50),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', null, {})
  }
}
