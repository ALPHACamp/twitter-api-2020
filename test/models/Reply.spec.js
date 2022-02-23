var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const ReplyModel = require('../../models/reply')

describe('# Reply Model', () => {
  // 使用寫好的 Reply Model
  const Reply = ReplyModel(sequelize, dataTypes)
  // 創建 reply instance 
  const like = new Reply()
  // 檢查 Model name
  checkModelName(Reply)('Reply')

   // 檢查 reply 是否有 __ 屬性(由於希望學員可以彈性命名 model 欄位，因此這邊留空)
  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
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
