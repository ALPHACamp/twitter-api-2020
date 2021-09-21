'use strict'

let likes = []
for (let i = 0; i < 150; i++) {
  // set Start and End date to generate random date
  let createdStart = new Date(2012, 0, 1)
  let createdEnd = new Date(2015, 0, 1)
  let updatedStart = new Date(2016, 0, 1)
  let updatedEnd = new Date(2020, 0, 1)

  let like = {
    UserId: Math.floor(Math.random() * 10),
    TweetId: Math.floor(Math.random() * 50),
    createdAt: new Date(createdStart.getTime() + Math.random() * (createdEnd.getTime() - createdStart.getTime())),
    updatedAt: new Date(updatedStart.getTime() + Math.random() * (updatedEnd.getTime() - updatedStart.getTime()))
  }
  likes.push(like)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', likes, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
