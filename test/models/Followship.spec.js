const chai = require('chai')
const sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const FollowshipModel = require('../../models/followship')

describe('# Followship Model', () => {
  // 使用寫好的 Followship Model
  const Followship = FollowshipModel(sequelize, dataTypes)
  // 創建 folloship instance
  const followship = new Followship()
  // 檢查 Model name
  checkModelName(Followship)('Followship')

  // 檢查 followship 是否有 followerId,followId 屬性
  context('properties', () => {
    ;[
      'followerId', 'followingId'
    ].forEach(checkPropertyExists(followship))
  })
})
