const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')

describe('# admin requests', () => {
  context('# GET ', () => {
    describe(' /api/admin/users', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        const rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, 'authenticate').callsFake(
          (strategy, options, callback) => {
            callback(null, { ...rootUser }, null)
            return (req, res, next) => {}
          }

        )

        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [], role: 'admin' })
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1', password: 'User1', role: 'admin' })
        await db.User.create({ account: 'User2', name: 'User2', email: 'User2', password: 'User2' })
      })

      // GET /admin/users - 看見站內所有的使用者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/admin/users')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('array')
            res.body[0].name.should.equal('root')
            return done()
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, truncate: true })
      })
    })
  })

  context('# DELETE ', () => {
    describe(' /api/admin/tweets/:id', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
        const rootUser = await db.User.create({ name: 'root' }); this.authenticate = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null)
          return (req, res, next) => {}
        })
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [], role: 'admin' })
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1', password: 'User1', role: 'admin' })
        await db.User.create({ account: 'User2', name: 'User2', email: 'User2', password: 'User2' })
        await db.Tweet.create({ UserId: 1, description: 'User1 的 description' })
      })

      // DELETE /admin/tweets/:id - 刪除使用者的推文
      it(' - successfully', (done) => {
        request(app)
          .delete('/api/admin/tweets/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            db.Tweet.findByPk(1).then(tweet => {
              expect(tweet).to.be.null
              return done()
            })
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
      })
    })
  })
})
