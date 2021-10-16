'use strict';
const db = require('../models')
const Chatmate = db.Chatmate
const faker = require('faker');

const getRoomInfo = new Promise((resolve, reject) => {
  Chatmate.findAll({
    raw: true,
    nest: true,
  }).then(roomInfos => {
    return resolve(roomInfos)
  })
})

function chatrecords(roomInfos) {
  const chatRecords = []
  roomInfos.forEach(roomInfo => {
    for (let i = 0; i < 3; i++) {
      chatRecords.push({
        roomId: roomInfo.id,
        speakerId: roomInfo.userAId,
        chatContent: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    for (let i = 0; i < 2; i++) {
      chatRecords.push({
        roomId: roomInfo.id,
        speakerId: roomInfo.userBId,
        chatContent: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  return chatRecords
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roomInfos = await getRoomInfo
    const chatrecordSeed = chatrecords(roomInfos)
    await queryInterface.bulkInsert('Chatrecords', chatrecordSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chatrecords', null, {})
  }
};
