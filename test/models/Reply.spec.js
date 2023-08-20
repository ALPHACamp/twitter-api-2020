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

describe('# Reply Model', () => {
  // 取出 Sequelize 的 DataTypes
  const { DataTypes } = Sequelize
  // 將 models/reply 中的 sequelize 取代成這裡的 Sequelize
  const ReplyFactory = proxyquire('../../models/reply', {
    sequelize: Sequelize
  })

  // 宣告 Reply 變數
  let Reply

  before(() => {
    // 賦予 Reply 值，成為 Reply Model 的 instance
    Reply = ReplyFactory(sequelize, DataTypes)
  })

  // 清除 init 過的資料
  after(() => {
    Reply.init.resetHistory()
  })

  // 檢查 reply 是否有 comment 屬性，自動化測試會用到
  context('properties', () => {
    it('called Reply.init with the correct parameters', () => {
      expect(Reply.init).to.have.been.calledWithMatch(
        {
          comment: DataTypes.TEXT,
        },
      )
    })
  })

  // 檢查 reply 的關聯是否正確 
  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      // 將 Reply model 對 User, Tweet 做關聯(呼叫 associate)
      Reply.associate({ User })
      Reply.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      // 檢查是否有呼叫 belongsTo(User)
      expect(Reply.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      // 檢查是否有呼叫 belongsTo(Tweet)
      expect(Reply.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })
  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {

    let data = null
    // 檢查 db.Reply 是否真的可以新增一筆資料
    it('create', (done) => {
      db.Reply.create({}).then((reply) => {   
        data = reply
        done()
      })
    })
    // 檢查 db.Reply 是否真的可以讀取一筆資料
    it('read', (done) => {
      db.Reply.findByPk(data.id).then((reply) => {  
        expect(data.id).to.be.equal(reply.id)
          done()
        })
    })
    // 檢查 db.Reply 是否真的可以更新一筆資料
    it('update', (done) => {
      db.Reply.update({}, { where: { id: data.id }}).then(() => {
        db.Reply.findByPk(data.id).then((reply) => { 
          expect(data.updatedAt).to.be.not.equal(reply.updatedAt) 
          done()
        })
      })
    })
    // 檢查 db.Reply 是否真的可以刪除一筆資料
    it('delete', (done) => {
      db.Reply.destroy({ where: { id: data.id }}).then(() => {
        db.Reply.findByPk(data.id).then((reply) => { 
          expect(reply).to.be.equal(null) 
          done()
        })
      })
    })
  })

})
