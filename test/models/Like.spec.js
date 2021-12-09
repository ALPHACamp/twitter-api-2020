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
const LikeModel = require('../../models/like')

describe('# Like Model', () => {
  // 使用寫好的 Like Model
  const Like = LikeModel(sequelize, dataTypes)
  // 創建 like instance
  const like = new Like()
  // 檢查 Model name
  checkModelName(Like)('Like')

  // 檢查 like 是否有 ___ 屬性(由於希望學員可以彈性命名 model 欄位，因此這邊留空)
  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  // 檢查 like 的關聯是否正確
  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      // 將 Like model 對 User, Tweet 做關聯(呼叫 associate)
      Like.associate({ User })
      Like.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      // 檢查是否有呼叫 belongsTo(User)
      expect(Like.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      // 檢查是否有呼叫 belongsTo(Tweet)
      expect(Like.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null

    // 檢查 db.Like 是否真的可以新增一筆資料
    it('create', (done) => {
      db.Like.create({}).then((like) => {
        data = like
        done()
      })
    })
    // 檢查 db.Like 是否真的可以讀取一筆資料
    it('read', (done) => {
      db.Like.findByPk(data.id).then((like) => {
        expect(data.id).to.be.equal(like.id)
        done()
      })
    })
    // 檢查 db.Like 是否真的可以更新一筆資料
    it('update', (done) => {
      db.Like.update({}, { where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(data.updatedAt).to.be.not.equal(like.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.Like 是否真的可以刪除一筆資料
    it('delete', (done) => {
      db.Like.destroy({ where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(like).to.be.equal(null)
          done()
        })
      })
    })
  })
})
