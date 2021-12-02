'use strict'
const db = require('../models')
const User = db.User
const _ = require('lodash')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: null } })
    let userArray = []
    for (let user of users) {
      userArray.push(user.id)
    }
    let arr = Array.from({ length: 100 }).map((v, i) => ({
      followingId: userArray[_.random(0, userArray.length - 1)],
      followerId: userArray[_.random(0, userArray.length - 1)],
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    let uniqArr = _.uniqBy(arr, function (user) {
      return user.followingId + user.followerId
    })
    uniqArr = _.reject(uniqArr, function (user) {
      return user.followerId === user.followingId
    })
    console.log(uniqArr)
    await queryInterface.bulkInsert('Followships', uniqArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Followships', null, {})
  }
}
