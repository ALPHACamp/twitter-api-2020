var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const FollowshipModel = require('../../models/followship')

describe('# Followship Model', () => {
  
  before(done => {
    done()
  })

  const Followship = FollowshipModel(sequelize, dataTypes)
  const followship = new Followship()
  checkModelName(Followship)('Followship')

  context('properties', () => {
    ;[
      'followerId', 'followingId'
    ].forEach(checkPropertyExists(followship))
  })

})
