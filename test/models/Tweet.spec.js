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
const TweetModel = require('../../models/tweet')

describe('# Tweet Model', () => {
  
  before(done => {
    done()

  })

  const Tweet = TweetModel(sequelize, dataTypes)
  const like = new Tweet()
  checkModelName(Tweet)('Tweet')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const Reply = 'Reply'
    const Like = 'Like'
    const User = 'User'
    before(() => {
      Tweet.associate({ Reply })
      Tweet.associate({ Like })
      Tweet.associate({ User })
    })

    it('should have many replies', (done) => {
      expect(Tweet.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many likes', (done) => {
      expect(Tweet.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should belong to user', (done) => {
      expect(Tweet.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Tweet.create({UserId: 1, description: 'hi'}).then((tweet) => {   
        data = tweet
        done()
      })
    })
    it('read', (done) => {
      db.Tweet.findByPk(data.id).then((tweet) => {  
        expect(data.id).to.be.equal(tweet.id)
          done()
        })
    })
    it('update', (done) => {
      db.Tweet.update({}, { where: { id: data.id }}).then(() => {
        db.Tweet.findByPk(data.id).then((tweet) => { 
          expect(data.updatedAt).to.be.not.equal(tweet.updatedAt) 
          done()
        })
      })
    })
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
