exports = module.exports = function(mongodb) {
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    var client = mongodb.createConnection(options);
    var store = new MongoStore({ client: client });
    if (connectListener) { store.once('connected', connectListener); }
    return store;
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/IService',
  'http://i.bixbyjs.org/http/ISessionStore'
];
exports['@name'] = 'sessions-mongodb';
exports['@port'] = 27017;
exports['@protocol'] = 'tcp';
exports['@require'] = [
  'http://i.bixbyjs.org/mongodb'
];
