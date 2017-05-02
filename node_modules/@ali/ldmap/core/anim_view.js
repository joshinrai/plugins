var View = require('./view');
var Animator = require('./animator');
var Utils = require('bcore/utils');

function AnimView(options) {
  options = this.options = Util.deepMerge(this.options, options);
}

AnimView = View.extend(AnimView);
Utils.merge(AnimView.prototype, Animator.prototype);

var optionsDefault = Utils.deepMerge(Animator.options || {}, View.options);
AnimView.options  = Utils.deepMerge(optionsDefault, AnimView.options);;
module.exports = AnimView;