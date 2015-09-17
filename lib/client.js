exports = module.exports = function() {
  var Client = require('./internals/client');
  
  var client = new Client();
  return client;
}


exports['@implements'] = 'http://i.bixbyjs.org/mongodb/Client';
exports['@require'] = [];
exports['@singleton'] = true;
