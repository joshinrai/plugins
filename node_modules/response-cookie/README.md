response-cookie [![Build Status](https://secure.travis-ci.org/fengmk2/response-cookie.png)](http://travis-ci.org/fengmk2/response-cookie) [![Coverage Status](https://coveralls.io/repos/fengmk2/response-cookie/badge.png)](https://coveralls.io/r/fengmk2/response-cookie)
===============

![logo](https://raw.github.com/fengmk2/response-cookie/master/logo.png)

cookie helpers for response. `connect` reponse cookie middleware.

## Install

```bash
$ npm install response-cookie
```

## Usage

### Use with `connect`

```js
connect(
  require('response-cookie')(),
  function (req, res) {
    res.clearCookie('oldCookie');
    res.cookie('foo', 'My name is cookie.');
    res.end('bar');
  }
);
```

### Use with `http`

```js
var cookie = require('response-cookie');

http.createServer(function (req, res) {
  cookie(res);
  res.clearCookie('oldCookie');
  res.cookie('foo', 'My name is cookie.');
  res.end('bar');
});
```

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
