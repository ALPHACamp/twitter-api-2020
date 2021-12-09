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
const UserModel = require('../../models/user')

describe('# User Model', () => {
  // 使用寫好的 User Model
  const User = UserModel(sequelize, dataTypes)
  // 創建 user instance
  const user = new User()
  // 檢查 Model name
  checkModelName(User)('User')

  // 檢查 user 是否有 name, email, password, account, cover, avatar 屬性
  context('properties', () => {
    ;[
      'name', 'email', 'password', 'account', 'cover', 'avatar'
    ].forEach(checkPropertyExists(user))
  })

  // 檢查 User 的關聯是否正確
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
    it('should have many followships', (done) => {
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
