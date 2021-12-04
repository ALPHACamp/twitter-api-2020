var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

// followship 相關功能測試
// 1. 可以追蹤使用者
// 2. 可以刪除追蹤使用者
describe('# followship requests', () => {

  context('# POST ', () => {

    describe(' /api/followships', () => {
      before(async() => {
        // 清除 User, Followship table 的測試資料庫資料
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
        // 模擬登入資料
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})
      })

      // 新增 POST /followships
      it.only(' - successfully', (done) => {
        request(app)
          .post('/api/followships')
          .send('id=2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 Followship 資料裡，是否有 followerId=1, followingId = 2 的資料
            
            // 這段是自己加的，測試檔可以在followship model中找到新增的資料
            db.Followship.findOne({ where: {id: 1 }}).then(followship => {
              console.log(followship)
              followship.followerId.should.equal(1);
              followship.followingId.should.equal(2);
              return done();
            })
            //這段是原本的，測試檔無法在followship model中找到新增的資料
            db.Followship.findByPk(1).then(followship => {
              console.log(followship)
              followship.followerId.should.equal(1);
              followship.followingId.should.equal(2);
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
      })

    });

  });

  context('# DELETE ', () => {

    describe(' /api/followships/:followingId', () => {
      before(async() => {
        // 清除 User table 的測試資料庫資料
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
        // 模擬登入資料
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})        
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Followship.create({followerId: 1, followingId: 2})
      })

      // 刪除 DETELE /followships/:followingId
      it(' - successfully', (done) => {
        request(app)
          .delete('/api/followships/2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 Followship 的資料是否已空，表示已被刪除
            db.Followship.findByPk(1).then(followship => {
              expect(followship).to.be.null
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
      })

    });

  });

});
