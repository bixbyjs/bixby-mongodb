var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/service');
var mongodb = require('mongodb');


describe('service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/mongodb', 'http://i.bixbyjs.org/IService' ]);
    expect(factory['@name']).to.equal('mongodb');
    expect(factory['@port']).to.equal(27017);
    expect(factory['@protocol']).to.equal('tcp');
  });
  
  describe('API', function() {
    var _keyring = { get: function(){} };
    var _client = new mongodb.MongoClient();
    var MongoClientStub = sinon.stub().returns(_client);
    var api = $require('../app/service',
      { 'mongodb': { MongoClient: MongoClientStub } }
    )(_keyring);
    
    
    describe('.createConnection', function() {
      beforeEach(function() {
        _client.s.options = {};
        
        sinon.stub(_keyring, 'get').withArgs('mongodb.example.com').yieldsAsync(null, { username: 'root', password: 'keyboard cat' })
                                   .withArgs('mongodb.example.org').yieldsAsync(null)
                                   .withArgs('localhost').yieldsAsync(null, { username: 'jaredhanson', password: 'h0m35w337h0m3' });
        
        sinon.stub(_client, 'connect').callsFake(function() {
          var self = this;
          process.nextTick(function() {
            self.emit('open');
          });
        });
      });
      
      afterEach(function() {
        MongoClientStub.resetHistory();
      });
      
      
      it('should construct client and connect', function(done) {
        var client = api.createConnection({ name: 'mongodb.example.com', port: 27017 });
        
        expect(MongoClientStub).to.have.been.calledOnceWithExactly('mongodb://mongodb.example.com:27017/insignature-tokens-development').and.calledWithNew;
        expect(client).to.be.an.instanceof(mongodb.MongoClient);
        
        client.once('open', function() {
          expect(client.s.options).to.deep.equal({ auth: { user: 'root', password: 'keyboard cat' } });
          done();
        });
      }); // should construct client and connect
      
      it('should construct client, add listener and connect', function(done) {
        var client = api.createConnection({ name: 'mongodb.example.com', port: 27017 }, function() {
          expect(this).to.be.an.instanceof(mongodb.MongoClient);
          expect(client.s.options).to.deep.equal({ auth: { user: 'root', password: 'keyboard cat' } });
          done();
        });
        
        expect(MongoClientStub).to.have.been.calledOnceWithExactly('mongodb://mongodb.example.com:27017/insignature-tokens-development').and.calledWithNew;
        expect(client).to.be.an.instanceof(mongodb.MongoClient);
      }); // should construct client, add listener and connect
      
      it('should construct client and connect without credentials', function(done) {
        var client = api.createConnection({ name: 'mongodb.example.org', port: 27017 });
        
        expect(MongoClientStub).to.have.been.calledOnceWithExactly('mongodb://mongodb.example.org:27017/insignature-tokens-development').and.calledWithNew;
        expect(client).to.be.an.instanceof(mongodb.MongoClient);
        
        client.once('open', function() {
          expect(client.s.options).to.deep.equal({});
          done();
        });
      }); // should construct client and connect without credentials
      
      it('should construct client and connect to address', function(done) {
        var client = api.createConnection({ name: 'localhost', address: '127.0.0.1', port: 27017 });
        
        expect(MongoClientStub).to.have.been.calledOnceWithExactly('mongodb://127.0.0.1:27017/insignature-tokens-development').and.calledWithNew;
        expect(client).to.be.an.instanceof(mongodb.MongoClient);
        
        client.once('open', function() {
          expect(client.s.options).to.deep.equal({ auth: { user: 'jaredhanson', password: 'h0m35w337h0m3' } });
          done();
        });
      }); // should construct client and connect
      
    }); // .createConnection
    
  }); // API
  
}); // service
