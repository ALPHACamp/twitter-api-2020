'use strict'
const faker = require('faker')

let tweets = []
for (let i = 0; i < 50; i++) {
  // set Start and End date to generate random date
  let createdStart = new Date(2012, 0, 1)
  let createdEnd = new Date(2015, 0, 1)
  let updatedStart = new Date(2016, 0, 1)
  let updatedEnd = new Date(2020, 0, 1)

  let tweet = {
    userId: Math.floor(Math.random() * 10),
    description: faker.lorem.text().substring(0, 140),
    createdAt: new Date(createdStart.getTime() + Math.random() * (createdEnd.getTime() - createdStart.getTime())),
    updatedAt: new Date(updatedStart.getTime() + Math.random() * (updatedEnd.getTime() - updatedStart.getTime()))
  }
  tweets.push(tweet)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
