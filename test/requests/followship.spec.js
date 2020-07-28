var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# followship requests', () => {

  context('# POST ', () => {

    describe(' /api/followships', () => {
      before(async() => {
        await db.User.destroy({where: {},truncate: true})
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
      })

      // 新增 POST /followships
      it(' - successfully', (done) => {
        request(app)
          .post('/api/followships')
          .send('id=2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            db.Followship.findByPk(1).then(followship => {
              followship.followerId.should.equal(1);
              followship.followingId.should.equal(2);
              return done();
            })
          })
      });

      after(async () => {
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
        await db.User.destroy({where: {},truncate: true})
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

      // 刪除 DETELE /followships/:followingId
      it(' - successfully', (done) => {
        request(app)
          .delete('/api/followships/2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            db.Followship.findByPk(1).then(followship => {
              expect(followship).to.be.null
              return done();
            })
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
      })

    });

  });

});
