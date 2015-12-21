'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

var TOKEN = '@ZHUIYUAN:Session';

function DataRepository() { // Singleton pattern
  if (typeof DataRepository.instance === 'object') {
    return DataRepository.instance;
  }

  DataRepository.instance = this;
}

//todo 官方AsyncStorage例子中使用了ES7提供的async/await语法，但是目前我这边测试的本地react-native所使用的babel并没有默认激活
//todo 这个特性，所以这里依然使用回调方式处理，有兴趣的可以看这篇文章：https://medium.com/the-exponent-log/react-native-meets-async-functions-3e6f81111173#.ekvqrsala
DataRepository.prototype.getToken = function(cb) {
  AsyncStorage.getItem(TOKEN, function(error, result){
      if(error){
        return cb(error);
      }
      return cb(null, JSON.parse(result));
  });
};

DataRepository.prototype.setToken = function(value, cb){
  AsyncStorage.setItem(TOKEN, JSON.stringify(value), function(error){
    return cb(error);
  });
}

DataRepository.prototype.clearToken = function(cb){
  AsyncStorage.removeItem(TOKEN, function(error){
    return cb(error);
  });
}

module.exports = DataRepository;
