var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')

// for authentication pass error
require('dotenv').config()
const passport = require('../../config/passport.js')
sinon.stub(
  passport, 'authenticate' // passport.authenticate() return a middleware
).returns((res, req, next) => {
  console.log('stub middleware')
  next()
})

var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('# admin requests', () => {

  context('# GET ', () => {

    describe(' /api/admin/users', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [], role: 'admin' });
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
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            res.body[0].name.should.equal('User1');
            return done();
          })
      });

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
      })

    });

  });

  context('# DELETE ', () => {

    describe(' /api/admin/tweets/:id', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [], role: 'admin' });
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
            if (err) return done(err);
            db.Tweet.findByPk(1).then(tweet => {
              expect(tweet).to.be.null
              return done();
            })

          })
      });

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
      })

    });

  });

});
