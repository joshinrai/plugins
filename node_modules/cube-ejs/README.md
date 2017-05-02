## install

  npm install cube-ejs

## this module need runtime lib

you should copy the `runtime.js` to your project

## write a processor

```js
function Processor(cube) {
  this.cube = cube;
}

Processor.info = {
  type: 'style',  //  can be: style|script|template
  ext: '.less'    //  file ext, let cube know which file request should router to this processor
}

/**
 * process code
 * @param  {String}   file     file path, relative to options.root
 * @param  {Object}   options   {root, compress, moduleWrap, qpath}
 * @param  {Function} callback(err, res)
 *                    res {source, code, wraped}
 */
Processor.prototype.process = function (file, options, callback) {
  // your code here
}

module.exports = Processor;
```

