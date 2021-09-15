var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# user requests', () => {

  context('# POST ', () => {

    describe('POST /api/users', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
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
            db.User.findByPk(1).then(user => {
              user.account.should.equal('User1');
              user.email.should.equal('User1@example.com');
              return done();
            })
          })
      });

      after(async () => {
        await db.User.destroy({where: {},truncate: true})
      })

    });

  });


  context('# GET ', () => {

    describe('GET /users/:id/followers', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
        const rootUser = await db.User.create({name: 'root'});this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null);
          return (req,res,next)=>{};
        });
        this.getUser = sinon.stub(
            helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({account: 'User1', name: 'User1', email: 'User1', password: 'User1'})        
        await db.User.create({account: 'User2', name: 'User2', email: 'User2', password: 'User2'})        
        await db.Followship.create({followerId: 1, followingId: 2})
      })

      // GET /users/:id/followers - 看見某使用者的跟隨者
      it(' - successfully', (done) => {
        request(app)
          .get('/api/users/2/followers')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);

            expect(res.body).to.be.an('array');
            res.body[0].followerId.should.equal(1);

            return done();
          })
      });

      after(async () => {

      })

    });


  });

});