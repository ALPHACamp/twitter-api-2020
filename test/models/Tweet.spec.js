const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Tweet Model', () => {
  // 取出 Sequelize 的 DataTypes
  const { DataTypes } = Sequelize
  // 將 models/tweet 中的 sequelize 取代成這裡的 Sequelize
  const TweetFactory = proxyquire('../../models/tweet', {
    sequelize: Sequelize
  })

  // 宣告 Tweet 變數
  let Tweet

  before(() => {
    // 賦予 Tweet 值，成為 Tweet Model 的 instance
    Tweet = TweetFactory(sequelize, DataTypes)
  })

  // 清除 init 過的資料
  after(() => {
    Tweet.init.resetHistory()
  })

  // 檢查 tweet 是否有 description 屬性, 自動化測試會用到
  context('properties', () => {
    it('called Tweet.init with the correct parameters', () => {
      expect(Tweet.init).to.have.been.calledWithMatch(
        {
          description: DataTypes.TEXT,
        },
      )
    })
  })

  // 檢查 tweet 的關聯是否正確
  context('associations', () => {
    const Reply = 'Reply'
    const Like = 'Like'
    const User = 'User'
    before(() => {
      // 將 Tweet model 對 User, Tweet, Reply 做關聯(呼叫 associate)
      Tweet.associate({ Reply })
      Tweet.associate({ Like })
      Tweet.associate({ User })
    })

    it('should have many replies', (done) => {
      // 檢查是否有呼叫 hasMany(Reply)
      expect(Tweet.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many likes', (done) => {
      // 檢查是否有呼叫 hasMany(Like)
      expect(Tweet.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should belong to user', (done) => {
      // 檢查是否有呼叫 belongsTo(User)
      expect(Tweet.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  // // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {

    let data = null
    // 檢查 db.Tweet 是否真的可以新增一筆資料
    it('create', (done) => {
      db.Tweet.create({UserId: 1, description: 'hi'}).then((tweet) => {   
        data = tweet
        done()
      })
    })
    // 檢查 db.Tweet 是否真的可以讀取一筆資料
    it('read', (done) => {
      db.Tweet.findByPk(data.id).then((tweet) => {  
        expect(data.id).to.be.equal(tweet.id)
          done()
        })
    })
    // 檢查 db.Tweet 是否真的可以更新一筆資料
    it('update', (done) => {
      db.Tweet.update({}, { where: { id: data.id }}).then(() => {
        db.Tweet.findByPk(data.id).then((tweet) => { 
          expect(data.updatedAt).to.be.not.equal(tweet.updatedAt) 
          done()
        })
      })
    })
    // 檢查 db.Tweet 是否真的可以刪除一筆資料
    it('delete', (done) => {
      db.Tweet.destroy({ where: { id: data.id }}).then(() => {
        db.Tweet.findByPk(data.id).then((tweet) => { 
          expect(tweet).to.be.equal(null) 
          done()
        })
      })
    })
  })

})
