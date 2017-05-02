var EventEmitter = require('bcore/event');

EventEmitter.prototype.off = EventEmitter.prototype.removeAllListeners;
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.fire = EventEmitter.prototype.fireEvent = EventEmitter.prototype.emit;
EventEmitter.prototype.clearAllEventListeners = EventEmitter.prototype.removeAllListeners;

module.exports = EventEmitter;