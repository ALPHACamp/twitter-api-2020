'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
    Array.from({length:30}).map((item,index) =>({
      id: index +1,
      user_id:Math.ceil(Math.random()*10),
      tweet_id: Math.ceil(Math.random() * 100),
      created_at: faker.date.between('2022-07-05T00:00:00.000Z', '2022-08-05T00:00:00.000Z'),
      updated_at: new Date()
    })
    ),{})  
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes',null,{})
   
  }
}
