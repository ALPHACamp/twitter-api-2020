'use strict';
// 載入所需套件
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = [] // 儲存產生的user資料

    // 產生admin資料，並塞進users的陣列中
    let admin = new Object()
    admin.email = 'root@example.com'
    admin.password = bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
    admin.account = 'root'
    admin.name = 'root'
    admin.avatar = 'https://cdn-icons-png.flaticon.com/512/483/483361.png'
    admin.cover = 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    admin.introduction = 'I am root'
    admin.role = 'admin'
    admin.createdAt = new Date()
    admin.updatedAt = new Date()
    users.push(admin)

    // 產生user資料，並塞進users陣列中
    for (let i = 0; i < 10; i++) {
      let data = new Object()
      data.email = `user${i + 1}@example.com`
      data.password = bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
      data.account = `user${i + 1}`
      data.name = `user${i + 1}`
      data.avatar = 'https://cdn-icons-png.flaticon.com/512/483/483361.png'
      data.cover = 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      data.introduction = `I am user${i + 1}`
      data.role = 'user'
      data.createdAt = new Date()
      data.updatedAt = new Date()
      users.push(data)
    }

    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
