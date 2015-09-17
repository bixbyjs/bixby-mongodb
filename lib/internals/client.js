var MongoClient = require('mongodb').MongoClient;


function Client() {
  this.db = null;
}

Client.prototype.connect = function(url, cb) {
  var self = this;
  MongoClient.connect(url, function(err, db) {
    if (err) { return cb(err); }
    self.db = db;
    return cb();
  });
}


module.exports = Client;
