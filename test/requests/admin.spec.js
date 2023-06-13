const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

// admin 相關功能測試
// 1. 管理者可以看見站內所有的使用者
// 2. 管理者可以刪除使用者的推文 
describe('# admin requests', () => {

  context('# GET ', () => {

    describe(' /api/admin/users', () => {
      before(async() => {
        // 清除 User table 的測試資料庫資料
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
        ).returns({id: 1, Followings: [], role: 'admin'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1', role: 'admin'})
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})
      })

      // GET /admin/users - 看見站內所有的使用者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/admin/users')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查回傳資料是否是陣列類型
            expect(res.body).to.be.an('array');
            // 檢查回傳資料是否有 3 筆使用者資料
            res.body.length.should.equal(3);
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

  });

  context('# DELETE ', () => {

    describe(' /api/admin/tweets/:id', () => {
      before(async() => {
        // 清除 User, Tweet table 的測試資料庫資料
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
        ).returns({id: 1, Followings: [], role: 'admin'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1', role: 'admin'})
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Tweet.create({UserId: 1, description: 'User1 的 description'})
      })

      // DELETE /admin/tweets/:id - 刪除使用者的推文
      it(' - successfully', (done) => {
        request(app)
          .delete('/api/admin/tweets/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否 Tweet table 中的資料是空的，表示有刪除成功
            db.Tweet.findByPk(1).then(tweet => {
              console.log(`====${tweet}====`)
              expect(tweet).to.be.null
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
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

});
