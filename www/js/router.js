angular.module('starter')
.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',function($httpProvider,$stateProvider,$urlRouterProvider,$ionicConfigProvider) {

  $stateProvider
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('guide', {
    url: '/guide',
    templateUrl: 'templates/guide.html',
    controller: 'guideCtrl'
  })
  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })
  .state('tab.newWord', {
    url: '/newWord',
    views: {
      'tab-newWord': {
        templateUrl: 'templates/newWord.html',
        controller: 'newWordCtrl'
      }
    }
  })
  .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'templates/my.html',
        controller: 'myCtrl'
      }
    }
  })
  .state('tab.home-search', { //搜索页面
    url: '/home/search',
    views: {
      'tab-home': {
        templateUrl: 'templates/home/search.html',
        controller: 'searchCtrl'
      }
    }
  })
  .state('tab.home-classify', { //分类页面
    url: '/home/classify',
    views: {
      'tab-home': {
        templateUrl: 'templates/home/classify.html',
        controller: 'classifyCtrl'
      }
    }
  })
  .state('home-newDetail', { //最新部分里面的节目详情页面
    url: '/home/newDetail/{type}/{title}',
    templateUrl: 'templates/home/newDetail.html',
    controller: 'newDetailCtrl'
  })
  .state('playing', { //正在播放页面
    url: '/playing/{type}/{id}',
    templateUrl: 'templates/playing.html',
    controller: 'playingCtrl'
  })
  .state('tab.my-msg', { //"我的"里面的消息页面
    url: '/my/msg',
    views: {
      'tab-my': {
        templateUrl: 'templates/my/msg.html',
        controller: 'msgCtrl'
      }
    }
  })
  .state('tab.my-setting', { //"我的"里面的设置页面
    url: '/my/setting',
    views: {
      'tab-my': {
        templateUrl: 'templates/my/setting.html',
        controller: 'settingCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('tab.home');
  $ionicConfigProvider.views.maxCache(5);//配置android和ios平台的缓存
  //配置对象$httpProvider.defaults.headers用于配置$http服务的http头
  //$ionicConfigProvider.views.transition('ios');
  //// Override $http service's default transformRequest
  ////这里[]里面的函数是一个转换函数，转换函数获取http请求体和请求头，并且返回他们的转换版（通常是序列化）
  //$httpProvider.defaults.transformRequest = [function(data) {
  //  /**
  //   * The workhorse; converts an object to x-www-form-urlencoded serialization.
  //   * @param {Object} obj
  //   * @return {String}
  //   */
  //  var param = function(obj) {
  //    var query = '';
  //    var name, value, fullSubName, subName, subValue, innerObj, i;
  //
  //    for (name in obj) {
  //      value = obj[name];
  //
  //      if (value instanceof Array) {
  //        for (i = 0; i < value.length; ++i) {
  //          subValue = value[i];
  //          fullSubName = name + '[' + i + ']';
  //          innerObj = {};
  //          innerObj[fullSubName] = subValue;
  //          query += param(innerObj) + '&';
  //        }
  //      } else if (value instanceof Object) {
  //        for (subName in value) {
  //          subValue = value[subName];
  //          fullSubName = name + '[' + subName + ']';
  //          innerObj = {};
  //          innerObj[fullSubName] = subValue;
  //          query += param(innerObj) + '&';
  //        }
  //      } else if (value !== undefined && value !== null) {
  //        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  //      }
  //    }
  //
  //    return query.length ? query.substr(0, query.length - 1) : query;
  //  };
  //  var ret = data;
  //  //判断data的请求头和请求体是不是标准的格式
  //  if(angular.isObject(data) && String(data) !== '[object File]'){
  //    ret = param(data);//转换http请求头和请求体
  //  }
  //  return ret;
  //}];
}]);
