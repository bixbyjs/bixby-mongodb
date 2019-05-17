exports = module.exports = function(keyring) {
  var mongodb = require('mongodb');
  var uri = require('url');
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    var url = uri.format({ protocol: 'mongodb', hostname: options.cname, port: options.port, slashes: true, pathname: '/insignature-tokens-development' });
    console.log(url)
    
    var client = new mongodb.MongoClient(url);
    
    client.on('connect', function() {
      console.log('MONGO CONNECT');
    });
    
    client.on('open', function() {
      console.log('MONGO OPEN');
    });
    
    client.on('authenticated', function(x) {
      console.log('MONGO AUTHENTICATED');
      console.log(x)
    });
    
    client.on('error', function(err) {
      console.log('MONGO ERROR!');
      console.log(err)
    });
    
    keyring.get(options.cname, function(err, cred) {
      // Setup auth  options on internal structures, since we don't have them yet on createConnection
      if (cred) {
        client.s.options.auth = { user: cred.username, password: cred.password };
      }
      
      // now we are ready, connect...
      client.connect(function(x) {
        console.log('MONGO CONNECTED CALLBACK!');
        //connectListener();
      });
    });
    
    return client;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/mongodb',
  'http://i.bixbyjs.org/IService'
];
exports['@name'] = 'mongodb';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
