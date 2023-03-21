const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# like requests', () => {

  context('# POST ', () => {

    describe(' /api/tweets/:id/like', () => {
      before(async() => {
        // 清除 User, Tweet, Like table 的測試資料庫資料
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
      })

      // POST /tweets/:id/like  喜歡一則推文
      it(' - successfully', (done) => {
        request(app)
          .post('/api/tweets/1/like')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 Like 資料裡，是否有 UserId=1, TweetId =1 的資料
            db.Like.findByPk(1).then(like => {
              like.UserId.should.equal(1);
              like.TweetId.should.equal(1);
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
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

    describe(' /api/tweets/:id/unlike', () => {
      before(async() => {
        // 清除 User, Tweet, Like table 的測試資料庫資料
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

      // POST /tweets/:id/unlike 取消喜歡
      it(' - successfully', (done) => {
        request(app)
          .post('/api/tweets/1/unlike')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否 Like table 中的資料是空的，表示有刪除成功
            db.Like.findByPk(1).then(like => {
              expect(like).to.be.null
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
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

});
