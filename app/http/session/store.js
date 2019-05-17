exports = module.exports = function(mongodb) {
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    console.log('CREATE MONGO SESSIONS CLIENT!');
    console.log(options);
    
    
    
    
    var client = mongodb.createConnection(options, function() {
      console.log('STORE CONNECTED CALLBACK!');
    });
    
    /*
    var promise = new Promise(function(resolve, reject) {
      client.on('open', function() {
        console.log('MONGO OPEN FOR SESSION?');
        //resolve(this);
      });
      
      
      client.on('__foo', function() {
        console.log('MONGO OPEN FOR __FOO?');
        resolve(this);
      });
    });
    */
    
    
    
    var store = new MongoStore({ client: client });
    //var store = new MongoStore({ clientPromise: promise });
    
    store.on('connect', function() {
      console.log('STORE CONNECT');
    });
    
    store.on('connected', function() {
      console.log('STORE CONNECTED!');
    });
    store.once('connected', connectListener);
    
    store.on('create', function() {
      console.log('STORE CREATED!');
    });
    
    //store.once('connect', connectListener);
    return store;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/IService',
  'http://i.bixbyjs.org/http/ISessionStore'
];
exports['@name'] = 'sessions-mongodb';
exports['@require'] = [
  'http://i.bixbyjs.org/mongodb'
];
