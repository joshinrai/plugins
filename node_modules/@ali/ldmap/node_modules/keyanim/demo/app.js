'use strict';
require.config({
  paths: {
    'zepto': './bower_components/zepto/zepto',
    'anim': './../anim',
    'async': './bower_components/async/lib/async'
  },
  shim: {
    'zepto': {
      'exports': '$'
    }
  }
});

define(['zepto', 'anim', 'async'], function($, $1, async) {

  var names = ['lightSpeedIn', 'lightSpeedOut', 'rotateInDownLeft', 'rotateOutUpRight', 'fadeInLeft', 'fadeOutRight', 'fadeIn', 'fadeOut', 'bounceIn', 'bounce', 'zoomIn'];
  var elem = $('.elem').addClass('elem-big');
  var button = $('.button');

  var scaleBig = $('.scale').filter('.btn-big').on('click',function(){
    scaleBig.addClass('active');
    scaleMiddle.removeClass('active');
    scaleSmall.removeClass('active');
    elem.removeClass('elem-middle elem-small').addClass('elem-big');
  });

  var scaleMiddle = $('.scale').filter('.btn-middle').on('click',function(){
    scaleMiddle.addClass('active');
    scaleBig.removeClass('active');
    scaleSmall.removeClass('active');
    elem.removeClass('elem-big elem-small').addClass('elem-middle');
  });

  var scaleSmall = $('.scale').filter('.btn-small').on('click',function(){
    scaleSmall.addClass('active');
    scaleBig.removeClass('active');
    scaleMiddle.removeClass('active');
    elem.removeClass('elem-middle elem-big').addClass('elem-small');
  });


  //生成async的队列的方法
  function generate(name) {
    var aname = name;
    return function(next) {
      button.text(aname);
      elem.keyAnim(aname, {
        'time': 2,
        'cb': function() {
          next();
        }
      });
    };
  }

  var funcs = [];
  for (var k in names) {
    funcs.push(generate(names[k], k));
  }

  function display() {
    button.off('click');
    async.waterfall(funcs, function(e, d) {
      button.text('重启');
      button.on('click', display);
    });
  }
  display();


});
