exports = module.exports = function(keyring) {
  var mongodb = require('mongodb');
  var uri = require('url');
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    // FIXME: Get path name from text record?
    var url = uri.format({ protocol: 'mongodb', hostname: options.cname, port: options.port, slashes: true, pathname: '/insignature-tokens-development' });
    
    var client = new mongodb.MongoClient(url);
    if (connectListener) { client.once('open', connectListener); }
    
    /*
    client.on('open', function(){});
    client.on('authenticated', function(){});
    client.on('close', function(){});
    */
    
    // TODO: Handle initial errors somehow...
    
    keyring.get(options.cname, function(err, cred) {
      // Setup auth  options on internal structures, since we don't have them yet on createConnection
      if (cred) {
        client.s.options.auth = { user: cred.username, password: cred.password };
      }
      
      // now we are ready, connect...
      client.connect();
    });
    
    return client;
  };
  
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
