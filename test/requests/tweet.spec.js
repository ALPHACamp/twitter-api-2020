const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# tweet requests', () => {

  context('# POST ', () => {

    describe('POST /api/tweets', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 模擬登入資料
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})
      })

      // 新增推文 - POST /tweets
      it(' - successfully', (done) => {
        request(app)
          .post('/api/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否有回傳正確資料
            db.Tweet.findByPk(1).then(tweet => {
              tweet.description.should.equal('description');
              tweet.UserId.should.equal(1);
              return done();
            })
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

  context('# GET ', () => {

    describe('GET /api/tweets', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 模擬登入資料
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet1'})
        await db.Reply.create({UserId: 1, TweetId: 1, comment: 'Tweet1 的 comment'})
      })

      // GET /tweets - 所有推文，包括推文作者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // 檢查是否回傳資料有 User1 的 Tweet1
            res.body[0].description.should.equal('User1 的 Tweet1');
            return done();
          })
      });

      // GET /tweets/:tweet_id - 一筆推文
      it(' - successfully', (done) => {
        request(app)
          .get('/api/tweets/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            // 檢查是否回傳資料有 User1 的 Tweet1 
            res.body.description.should.equal('User1 的 Tweet1');
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

});
