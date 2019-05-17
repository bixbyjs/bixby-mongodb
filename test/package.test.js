/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');


describe('bixby-mongodb', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('opt/mongodb');
      
      expect(json.assembly.components).to.have.length(2);
      expect(json.assembly.components).to.include('service');
      expect(json.assembly.components).to.include('http/session/store');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});

afterEach(function() {
  sinon.restore();
});
