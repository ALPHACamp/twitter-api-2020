var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# like requests', () => {

  context('# POST ', () => {

    describe(' /api/tweets/:id/like', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
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
            db.Like.findByPk(1).then(like => {
              like.UserId.should.equal(1);
              like.TweetId.should.equal(1);
              return done();
            })
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
      })

    });

    describe(' /api/tweets/:id/unlike', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
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
            db.Like.findByPk(1).then(like => {
              expect(like).to.be.null
              return done();
            })
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
      })

    });

  });

});
