var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var ug = require('uglify-js');

function EjsProcessor(cube) {
  this.cube = cube;
}
EjsProcessor.info = {
  type: 'template',
  ext: '.ejs'
};

EjsProcessor.prototype = {
  process: function (file, options, callback) {
    var code;
    var res = {};
    var root = options.root;
    var fpath = path.join(root, file);
    code = fs.readFileSync(fpath, 'utf8').toString();
    res.source = code;
    try {
      var resFun = ejs.compile(code, {filename: fpath, client: true, compileDebug: !options.compress});
      code = resFun.toString();
    } catch (e) {
      e.message += '\n file:' + file;
      return callback(e);
    }
    if (options.compress) {
      code = ug.minify(code, {fromString: true}).code;
    }
    if (options.moduleWrap) {
      var wraped = 'var f = require("ejs_runtime");' + code +
         ';module.exports=function(o, cf){\
        for(var i in cf) {\
          if (cf.hasOwnProperty(i)) {\
            f[i] = cf[i];\
          }\
        }; return anonymous(o, f)};';
      res.wraped = this.cube.wrapTemplate(options.qpath, wraped, ['ejs_runtime']);
    }
    res.code = code;

    callback(null, res);
  }
};

module.exports = EjsProcessor;