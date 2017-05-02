/*!
 * response-cookie - lib/cookie
 *
 * identifying code: https://github.com/visionmedia/express/blob/master/lib/response.js#L537
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var cookie = require('cookie');
var cookieSignature = require('cookie-signature');

/**
 * Cookie middleware.
 *
 * ```js
 * connect(cookie());
 * ```
 */
module.exports = function (response) {
  if (arguments.length === 0) {
    // connect middleware
    return function cookieMiddleware(req, res, next) {
      if (!res.req) {
        res.req = req;
      }
      res.cookie = setCookie;
      res.clearCookie = clearCookie;
      next();
    };
  }

  // cookie(res);
  response.cookie = setCookie;
  response.clearCookie = clearCookie;
};

function merge(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
}

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} options
 * @param {ServerResponse} for chaining
 * @api public
 */

function clearCookie(name, options) {
  var opts = {expires: new Date(1), path: '/'};
  return this.cookie(name, '', options ? merge(opts, options) : opts);
}

/**
 * Set cookie `name` to `val`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `signed`   sign the cookie
 *    - `path`     defaults to "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // save as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String|Object} val
 * @param {Options} options
 * @api public
 */

function setCookie(name, val, options) {
  options = options || {};
  var secret = null;
  var signed = options.signed;
  if (signed) {
    secret = this.req && this.req.secret;
    if (!secret) {
      throw new Error('connect.cookieParser("secret") required for signed cookies');
    }
  }
  if ('object' === typeof val) {
    val = 'j:' + JSON.stringify(val);
  }
  if (signed) {
    val = 's:' + cookieSignature.sign(val, secret);
  }
  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge);
  }
  if (!options.path) {
    options.path = '/';
  }
  this.setHeader('Set-Cookie', cookie.serialize(name, String(val), options));
  return this;
}
