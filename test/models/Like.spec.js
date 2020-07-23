var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const LikeModel = require('../../models/like')

describe('# Like Model', () => {
  
  before(done => {
    done()
  })

  const Like = LikeModel(sequelize, dataTypes)
  const like = new Like()
  checkModelName(Like)('Like')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      Like.associate({ User })
      Like.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Like.create({}).then((like) => {   
        data = like
        done()
      })
    })
    it('read', (done) => {
        db.Like.findByPk(data.id).then((like) => {  
          expect(data.id).to.be.equal(like.id)
          done()
        })
    })
    it('update', (done) => {
      db.Like.update({}, { where: { id: data.id }}).then(() => {
        db.Like.findByPk(data.id).then((like) => { 
          expect(data.updatedAt).to.be.not.equal(like.updatedAt) 
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Like.destroy({ where: { id: data.id }}).then(() => {
        db.Like.findByPk(data.id).then((like) => { 
          expect(like).to.be.equal(null) 
          done()
        })
      })
    })
  })

})
