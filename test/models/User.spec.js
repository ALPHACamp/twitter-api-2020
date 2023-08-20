const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire');
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

const db = require('../../models')

describe('# User Model', () => {
  // 取出 Sequelize 的 DataTypes
  const { DataTypes } = Sequelize
  // 將 models/user 中的 sequelize 取代成這裡的 Sequelize
  const UserFactory = proxyquire('../../models/user', {
    sequelize: Sequelize
  })

  // 宣告 User 變數
  let User

  before(() => {
    // 賦予 User 值，成為 User Model 的 instance
    User = UserFactory(sequelize, DataTypes)
  })

  // 清除 init 過的資料
  after(() => {
    User.init.resetHistory()
  })

  // 檢查 user 是否有 name 屬性, 自動化測試會用到
  context('properties', () => {
    it('called User.init with the correct parameters', () => {
      expect(User.init).to.have.been.calledWithMatch(
        {
          name: DataTypes.STRING,
        }
      )
    })
  })

  // 檢查 tweet 的關聯是否正確
  context('associations', () => {
    const Reply = 'Reply'
    const Tweet = 'Tweet'
    const Like = 'Like'
    before(() => {
      // 將 User model 對 User, Tweet, Reply, Like 做關聯(呼叫 associate)
      User.associate({ Reply })
      User.associate({ Tweet })
      User.associate({ Like })
      User.associate({ User })
    })

    it('should have many replies', (done) => {
      // 檢查是否有呼叫 hasMany(Reply)
      expect(User.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many tweets', (done) => {
      // 檢查是否有呼叫 hasMany(Tweet)
      expect(User.hasMany).to.have.been.calledWith(Tweet)
      done()
    })
    it('should have many likes', (done) => {
      // 檢查是否有呼叫 hasMany(Like)
      expect(User.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should have many Users', (done) => {
      // 檢查是否有呼叫 belongsToMany(User)
      expect(User.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null
    // 檢查 db.User 是否真的可以新增一筆資料
    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    // 檢查 db.User 是否真的可以讀取一筆資料
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    // 檢查 db.User 是否真的可以更新一筆資料
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.User 是否真的可以刪除一筆資料
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
