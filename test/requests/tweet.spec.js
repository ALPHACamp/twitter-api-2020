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

describe('# tweet requests', () => {

  context('# POST ', () => {

    describe('POST /api/tweets', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [] });
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1', password: 'User1' })
      })

      // 新增推文 - POST /tweets
      it(' - successfully', (done) => {
        request(app)
          .post('/api/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            db.Tweet.findByPk(1).then(tweet => {
              tweet.description.should.equal('description');
              tweet.UserId.should.equal(1);
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

  context('# GET ', () => {

    describe('GET /api/tweets', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.Tweet.destroy({ where: {}, truncate: true })
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [] });
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1', password: 'User1' })
        await db.Tweet.create({ UserId: 1, description: 'User1 的 Tweet1' })
      })

      // GET /tweets - 所有推文，包括推文作者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            res.body[0].description.should.equal('User1 的 Tweet1');
            return done();
          })
      });

      // GET /tweets/:tweet_id - 一筆推文與回覆
      it(' - successfully', (done) => {
        request(app)
          .get('/api/tweets/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            res.body.description.should.equal('User1 的 Tweet1');
            return done();
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
