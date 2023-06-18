'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://imgur.com/5OL5wJt.png',
      cover_photo: 'https://imgur.com/JzwDxR1.png',
      introduction: '大家好，我是一個對挑戰充滿熱情的人。我喜歡學習和不斷成長。',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/EgMXcng.jpeg',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: '大家好，我是一位熱愛挑戰的人。對於新事物充滿好奇心，樂於嘗試各種不同的領域。',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/SgYAPju.jpeg',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: '大家好，我是一個對創造和表達充滿熱情的人。我喜歡用文字和影像來傳達思想和情感。',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/84KCSTL.jpeg',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: '大家好，我是一個熱衷於社會公益的人。我相信每個人都有責任為社會做出貢獻，並幫助那些需要幫助的人。',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/A4V3izq.jpeg',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: '大家好，我是一個擁有豐富國際交流經驗的人。我曾在多個國家生活和工作，學習不同文化和語言。',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/VHLZUkq.jpeg',
      cover_photo: 'https://imgur.com/hJ4J9gn.png',
      introduction: '大家好，我是一個熱愛學習和不斷成長的人。我相信知識是無窮的，只有不斷學習才能夠不斷進步。',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
