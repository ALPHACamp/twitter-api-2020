const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

describe('# Followship Model', () => {
  // 取出 Sequelize 的 DataTypes
  const { DataTypes } = Sequelize
  // 將 models/followship 中的 sequelize 取代成這裡的 Sequelize
  const FollowFactory = proxyquire('../../models/followship', {
    sequelize: Sequelize
  })

  // 宣告 FollowShip 變數
  let FollowShip

  before(() => {
    // 賦予 FollowShip 值，成為 FollowShip Model
    FollowShip = FollowFactory(sequelize, DataTypes)
  })

  // 清除 init 過的資料
  after(() => {
    FollowShip.init.resetHistory()
  })

  // 檢查 followship 是否有 followerId,followId 屬性
  it('called FollowShip.init with the correct parameters', () => {
    expect(FollowShip.init).to.have.been.calledWithMatch(
      {
        followerId: DataTypes.INTEGER,
        followingId: DataTypes.INTEGER
      }
    )
  })

})
