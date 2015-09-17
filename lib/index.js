/**
 * Expose component suite.
 */
exports = module.exports = function www(id) {
  var map = {
    'client': './client',
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.used = function(container) {
  // Register specs so objects can be auto-wired by interface.
  container.register('client');
}
