var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/session/store');
var mongodb = require('mongodb');
var MongoStore = require('connect-mongo')(require('express-session'));


describe('http/session/store', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/IService', 'http://i.bixbyjs.org/http/ISessionStore' ]);
    expect(factory['@name']).to.equal('sessions-mongodb');
    expect(factory['@port']).to.equal(27017);
    expect(factory['@protocol']).to.equal('tcp');
  });
  
  describe('API', function() {
    var _mongodb = { createConnection: function(){} };
    var _store = new MongoStore({ client: sinon.createStubInstance(mongodb.MongoClient) });
    var MongoStoreStub = sinon.stub().returns(_store);
    var api = $require('../../../app/http/session/store',
      { 'connect-mongo': function() { return MongoStoreStub; } }
    )(_mongodb);
    
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_mongodb, 'createConnection').returns(sinon.createStubInstance(mongodb.MongoClient));
      });
      
      afterEach(function() {
        MongoStoreStub.resetHistory();
      });
      
      
      it('should construct store', function() {
        var store = api.createConnection({ cname: 'mongodb.example.com', port: 27017 });
        
        expect(_mongodb.createConnection).to.have.been.calledOnceWithExactly({ cname: 'mongodb.example.com', port: 27017 });
        expect(MongoStoreStub).to.have.been.calledOnce.and.calledWithNew;
        expect(MongoStoreStub.getCall(0).args[0].client).to.be.an.instanceof(mongodb.MongoClient);
        expect(store).to.be.an.instanceof(MongoStore);
      }); // should construct store
      
      it('should construct store and add listener', function(done) {
        var store = api.createConnection({ cname: 'mongodb.example.com', port: 27017 }, function() {
          done();
        });
        
        expect(_mongodb.createConnection).to.have.been.calledOnceWithExactly({ cname: 'mongodb.example.com', port: 27017 });
        expect(MongoStoreStub).to.have.been.calledOnce.and.calledWithNew;
        expect(MongoStoreStub.getCall(0).args[0].client).to.be.an.instanceof(mongodb.MongoClient);
        expect(store).to.be.an.instanceof(MongoStore);
        
        process.nextTick(function() {
          store.emit('connected');
        });
      }); // should construct store and add listener
      
    }); // .createConnection
    
  }); // API
  
}); // http/session/store
