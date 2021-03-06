var exec = require('../child_utils').exec;
var hasOwnProperty = require('has');

/**
 * Create a set identified with setsetname and specified type.
 *
 * @param options
 * @param cb
 */
module.exports = function (options, cb) {
  if (typeof arguments[0] != 'object') {
    throw new Error('Invalid arguments. Signature: (options, callback?)');
  }

  var ipset_cmd = (options.sudo)
    ? 'sudo'
    : '';

  /*
   * Build cmd to execute.
   */
  var cmd = [ipset_cmd, 'ipset', 'create', '-exist'];
  var args = [];

  /*
   * Process options.
   */
  if (typeof options.setname != 'undefined') {
    args = args.concat(options.setname);
  }

  if (typeof options.type != 'undefined') {
    args = args.concat(options.type);
  }

  /*
   * An array of {key: value} pair.
   */
  if (typeof options['create_options'] != 'undefined') {
    for (var i in options['create_options']) {
      if (hasOwnProperty(options['create_options'], i)) {
        args = args.concat(i, options['create_options'][i]);
      }
    }
  }

  /*
   * Execute command.
   */
  exec(cmd.concat(args).join(' '), {queue: options.queue}, function (error, stdout, stderror) {
    if (error && cb) {
      var err = new Error(stderror.split('\n')[0]);
      err.cmd = cmd.concat(args).join(' ');
      err.code = error.code;

      cb(err);
    }
    else if (cb) {
      cb(null);
    }
  });
};
