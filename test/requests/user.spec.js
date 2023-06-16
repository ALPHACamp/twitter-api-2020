const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should()
const expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# user requests', () => {

  context('# POST ', () => {

    describe('POST /api/users', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

      // 註冊自己的帳號 POST /users
      it(' - successfully', (done) => {
        request(app)
          .post('/api/users')
          .send('account=User1&name=User1&email=User1@example.com&password=User1&checkPassword=User1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否有成功新增資料到資料庫裡
            db.User.findByPk(1).then(user => {
              user.account.should.equal('User1');
              user.email.should.equal('User1@example.com');
              return done();
            })
          })
      });

      after(async () => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });


  context('# GET ', () => {

    describe('GET /users/:id', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
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
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})
      })


      // GET /users/:id
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否回傳資料裡有 root 的資料
            res.body.name.should.equal('root');

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });


    describe('GET /users/:id/tweets', () => {
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
      })

      // GET /users/:id/tweets - 看見某使用者發過的推文
      it(' - self successfully', (done) => {
        request(app)
          .get('/api/users/1/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // 有回傳某使用者的推文資料
            res.body[0].description.should.equal('User1 的 Tweet1');

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

    describe('GET /users/:id/replied_tweets', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Reply.destroy({where: {},truncate: true, force: true})
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
      // GET /users/:id/replied_tweets - 看見某使用者發過回覆的推文
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/1/replied_tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);

            expect(res.body).to.be.an('array');
            // 有回傳 Tweet1 的 comment 這筆資料
            res.body[0].comment.should.equal('Tweet1 的 comment');

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Reply.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

    describe('GET /users/:id/likes', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
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
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Tweet.create({UserId: 2, description: 'User2 的 Tweet1'})
        await db.Like.create({UserId: 1, TweetId: 1})
      })
      
      // GET /users/:id/likes - 看見某使用者點過的 Like 
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/1/likes')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // 檢查回傳資料是否有 TweetId = 1
            res.body[0].TweetId.should.equal(1);

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });


    describe('GET /users/:id/followings', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 模擬登入資料
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})        
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Followship.create({followerId: 1, followingId: 2})
      })
      // GET /users/:id/followings - 看見某使用者跟隨中的人
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/1/followings')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);

            expect(res.body).to.be.an('array');
            //回傳資料中是否有跟隨中的人的 id = 2
            res.body[0].followingId.should.equal(2);

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

    describe('GET /users/:id/followers', () => {
      before(async() => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
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
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Followship.create({followerId: 1, followingId: 2})
      })
      // ############################################################################################
      // ############################################################################################
      // GET /users/:id/followers - 看見某使用者的跟隨者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/2/followers')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);

            expect(res.body).to.be.an('array');
            // 有跟隨者的 followerId = 1
            res.body[0].followerId.should.equal(1);

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });


  });


  context('# PUT ', () => {

    describe('PUT /api/users/:id', () => {
      before(async() => {
        // 清除 User, Tweet table 的測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
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
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1', introduction: 'User1'})
      })
      // ############################################################################################
      // ############################################################################################
      // 編輯自己所有的資料 PUT /users/:id
      it(' - successfully', (done) => {
        request(app)
          .put('/api/users/1')
          .send('name=User11&introduction=User11')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            db.User.findByPk(1).then(user => {
              // 檢查資料是否有變更
              user.name.should.equal('User11');
              user.introduction.should.equal('User11');
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

});