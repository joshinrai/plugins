'use strict';
/**
 * Stream 对流式数据进行管理
 * @param {Object} opt 配置
 */
 function getLength (obj) {
    var index = 0;
    for(var k in obj) {
      index++;
    }
    return index;
  }

var eventEmitter = require('bcore/event');
var Utils = require('./utils')
function isNone(d) {
  return d === null || d === undefined || isNaN(d);
}


function Stream(options) {
  this.options = Utils.deepMerge(this.options, options);
  this.localDatas = {};
}

eventEmitter.extend(Stream, {
  options: {
    isDeleteDiff: true,
    /**
     * getCellID 获取id的方法
     * @param  {Object} d    一行数据
     * @param  {String} k    数据所属的key
     * @param  {String} type 数组或对象
     */
    getCellID: function(d, k, type) { //获取id的方法
      if (type === 'array') {
        return d.id || 'id_' + Math.floor(Math.random() * 100000000000000);
      }
      return d.id || k || 'id_' + Math.floor(Math.random() * 100000000000000);
    }
  },
  dataN: 0,
  datasN: 0,
  valueMax: null,
  valueMin: null,
  versionIdCount: 0,
  /**
   * getValue 从数据中提取需要呈现的值的方法
   * @param  {Object} d 一行数据
   */
  getValue: function (d) { //计算需要进行比较的value
    return d.value;
  },

  getVersionId: function () {
    return 'version_id_' + this.versionIdCount++;
  },
  /**
   * write 将新数据写入组件
   * @param  {Objects/Array} datas 传入的数据http://localhost:9999/screen/s2
   */
  write: function (datas) {
    if (!datas) return;
    var versionID =  this.getVersionId();

    var localDatas = this.localDatas;
    var updates = {}; //增量部分的数据
    var getCellID = this.options.getCellID;
    var data, id, k;
    if (Array.isArray(datas)) {
      for (k = 0; k < datas.length; k++) {
        data = datas[k];
        id = getCellID(data, k, 'array');
        this.wrapper(id, data, localDatas, versionID, updates);
      }
    } else {
      for (k in datas) {
        if (datas.hasOwnProperty(k)) {
          data = datas[k];
          id = getCellID(data, k, 'object');
          this.wrapper(id, data, localDatas, versionID, updates);
        }
      }
    }

    if (this.options.isDeleteDiff) {
      for (id in localDatas) {
        if (localDatas[id] && localDatas[id].version !== versionID) {
          this.destroy(id);
        }
      }
    }

    this.emit('update-data', updates);
    this.emit('all-data', localDatas); // 全量数据
    this.datasN++;
  },

  /**
   * updateRange 对最大是最小值进行更新
   * @param  {Object} data 一行数据
   */
  updateRange: function (data) { //更新最大值和最小值
    var needEmit = false;
    if (!this.getValue) return;
    var value = this.getValue(data);
    if (isNone(value)) return;
    if (isNone(this.valueMax)) {
      this.valueMax = value;
    }
    if (isNone(this.valueMin)) {
      this.valueMin = value;
    }
    if (this.valueMax < value) {
      this.valueMax = value;
      needEmit = true;
    }
    if (this.valueMin > value) {
      needEmit = true;
      this.valueMin = value;
    }
    if (needEmit) {
      this.emit('update-range', {
        max: this.valueMax,
        min: this.valueMin
      });
    }
  },


  /**
   * wrapper 对数据进行包壳
   * @param  {String} id         这行数据的id
   * @param  {Object} data       一行数据
   * @param  {Object} localDatas 本地暂存的数据
   * @param  {String} versionID  本次更新的事件id
   * @param  {Object} updates    本次跟新的所有数据
   */
  wrapper: function (id, data, localDatas, versionID, updates) {
    this.updateRange(data);

    var wrapper = localDatas[id];

    if (wrapper) {
      wrapper.data = data;
      wrapper.version = versionID;
      wrapper.action = 'update';
    } else {
      wrapper = localDatas[id] = {
        id: id,
        data: data,
        version: versionID,
        action: 'new'
      };
    }
    updates[id] = wrapper;
    this.emit('update-row', wrapper);
    this.dataN++;
  },

/**
 * destroy 销毁key为id的数据
 */
destroy: function (id) {
  var localDatas = this.localDatas;
  if (localDatas) {
    var obj = localDatas[id];
    this.emit('delete-row', obj);
    delete localDatas[id];
  }
},
/**
 * destroyAll 销毁所有的数据
 */
destroyAll: function () {
  var localDatas = this.localDatas;
  if (localDatas) {
    for (var id in localDatas) {
      this.destroy(id);
    }
  }
}
});

module.exports = Stream;