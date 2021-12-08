'use strict'

const { jar } = require('request')
const user = require('../models/user')
const { randomDate } = require('../_helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Followships',
      [
        {
          id: 1,
          followerId: 11,
          followingId: 21,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 11,
          followerId: 11,
          followingId: 41,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 21,
          followerId: 21,
          followingId: 11,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 31,
          followerId: 21,
          followingId: 41,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 41,
          followerId: 31,
          followingId: 21,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 51,
          followerId: 31,
          followingId: 51,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 61,
          followerId: 41,
          followingId: 11,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 71,
          followerId: 41,
          followingId: 51,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 81,
          followerId: 51,
          followingId: 31,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        },
        {
          id: 91,
          followerId: 51,
          followingId: 11,
          createdAt: randomDate(new Date(2021, 11, 1), new Date(), 0, 24),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
