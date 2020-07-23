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
const ReplyModel = require('../../models/reply')

describe('# Reply Model', () => {
  
  before(done => {
    done()
  })

  const Reply = ReplyModel(sequelize, dataTypes)
  const like = new Reply()
  checkModelName(Reply)('Reply')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      Reply.associate({ User })
      Reply.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      expect(Reply.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      expect(Reply.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Reply.create({}).then((reply) => {   
        data = reply
        done()
      })
    })
    it('read', (done) => {
      db.Reply.findByPk(data.id).then((reply) => {  
        expect(data.id).to.be.equal(reply.id)
          done()
        })
    })
    it('update', (done) => {
      db.Reply.update({}, { where: { id: data.id }}).then(() => {
        db.Reply.findByPk(data.id).then((reply) => { 
          expect(data.updatedAt).to.be.not.equal(reply.updatedAt) 
          done()
        })
      })
    })
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
