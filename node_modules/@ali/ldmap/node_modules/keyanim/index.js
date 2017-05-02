'use strict';

! function(root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var $;
    try{
      // $ = require('zepto');
    } catch (e) {
    }
    try {
      $ = require('jquery');
    }catch (e) {
    }
    module.exports = factory($);
  } else if (typeof define === 'function' && define.amd) {
    define(['zepto'], factory);
  } else {
    factory(root.jQuery);
  }
}(this, function($) {

  $.fn.keyAnim = function(keyframe, opt) {
    var time = opt.time || 1;
    var count = opt.count || 1;
    var node = $(this);
    var cb = opt.cb;
    var delay = opt.delay || 0.001;
    var timing = opt.timing || 'linear';
    var anim = {
      '-webkit-animation-name': keyframe,
      '-moz-animation-name': keyframe,
      '-o-animation-name': keyframe,
      'animation-name': keyframe,
      '-webkit-animation-duration': time + 's',
      '-moz-animation-duration': time + 's',
      '-o-animation-duration': time + 's',
      'animation-duration': time + 's',
      '-webkit-animation-fill-mode': 'both',
      '-moz-animation-fill-mode': 'both',
      '-o-animation-fill-mode': 'both',
      'animation-fill-mode': 'both',
      'animation-iteration-count': count,
      '-webkit-animation-iteration-count': count,
      '-webkit-animation-delay': delay + 's',
      'animation-delay': delay + 's',
      '-webkit-animation-timing-function': timing,
      'animation-timing-function': timing,
      'animation-play-state': 'running',
      '-webkit-animation-play-state': 'running'
    };
    node.css(anim);
    if (cb) {
      node.off('webkitAnimationEnd animationend').one('webkitAnimationEnd animationend', cb);
    }
    return this;
  };

  $.fn.stopAnim = function () {
    $(this).css({
      'animation-play-state': 'paused',
      '-webkit-animation-play-state': 'paused'
    });
  };

  $.fn.resumeAnim = function () {
    $(this).css({
      'animation-play-state': 'running',
      '-webkit-animation-play-state': 'running'
    });
  };


  var aniStyles = ['-webkit-animation-delay', 'animation-delay', '-webkit-animation-timing-function', '-webkit-animation-name', 'animation-timing-function', '-moz-animation-name', '-o-animation-name', 'animation-name', '-webkit-animation-duration', '-moz-animation-duration', '-o-animation-duration', 'animation-duration', '-webkit-animation-fill-mode', '-moz-animation-fill-mode', '-o-animation-fill-mode', 'animation-fill-mode', '-webkit-animation-iteration-count', 'animation-iteration-count', '-webkit-animation-play-state','animation-play-state'];
  /**
   * clearAnim 剔除行内样式中 和动画有关的部分
   */
  $.fn.clearAnim = function () {
    var node = $(this);
    var nodeStyle = node.attr('style');
    var search, aniStyle;
    for (var k in aniStyles) {
      aniStyle = aniStyles[k];
      search = new RegExp(aniStyle + '[^;]+;?', 'g');
      nodeStyle = nodeStyle.replace(search, '');
    }
    node.attr('style', nodeStyle);
    return this;
  };
  return $;
});