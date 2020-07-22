var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const UserModel = require('../../models/user')

describe('# User Model', () => {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;[
      'name', 'email', 'password', 'account',  'cover', 'avatar'
    ].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const Reply = 'Reply'
    const Tweet = 'Tweet'
    const Like = 'Like'
    const Followship = 'Followship'
    before(() => {
      User.associate({ Reply })
      User.associate({ Tweet })
      User.associate({ Like })
      User.associate({ User })
    })

    it('should have many replies', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many tweets', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Tweet)
      done()
    })
    it('should have many likes', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should have many followships', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
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
