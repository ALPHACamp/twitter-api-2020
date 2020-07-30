var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# reply requests', () => {

  context('# POST ', () => {

    describe(' /api/tweets/:tweet_id/replies', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
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

      // 新增回覆 POST /tweets/:tweet_id/replies
      it(' - successfully', (done) => {
        request(app)
          .post('/api/tweets/1/replies')
          .send('comment=comment')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            db.Reply.findByPk(1).then(reply => {
              reply.comment.should.equal('comment');
              reply.UserId.should.equal(1);
              reply.TweetId.should.equal(1);
              return done();
            })
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
      })

    });

  });

  context('# GET ', () => {

    describe('GET /api/tweets/:tweet_id/replies', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet1'})
        await db.Reply.create({UserId: 1, TweetId: 1, comment: 'Tweet1 的 comment'})
      })

      // 瀏覽 GET /tweets/:tweet_id/replies
      it(' - successfully', (done) => {
        request(app)
          .get('/api/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            res.body[0].comment.should.equal('Tweet1 的 comment');
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
      })

    });

  });

});
