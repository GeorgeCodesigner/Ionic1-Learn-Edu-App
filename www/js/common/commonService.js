/**
 * Created by chencz on 2017/2/22.
 */
angular.module('commonService', [])
//ajax service:提供get,post请求
.factory('ajax',function($q, $http,$rootScope,$ionicPopup){
  var contextPath = config.baseUrl;
  return {
    get : function  (url,params,otherUrl) {
      var d = $q.defer();
      if($rootScope.isOnline == false) {
        $ionicPopup.alert({
          title: "没有可用网络",
          content: "您当前的设备没有接入网络."
        });
      } else {
        params = params || {};//对参数初始化
        //拼接参数（？&）
        angular.forEach(params, function(value, key) {
          if(/\?/.test(url)){
            url  +="&"+key+"="+value;
          }else{
            url +="?"+key+"="+value;
          }
        });
        if(url=="false"&& otherUrl){
          $http.get(otherUrl)
            .success(function (data) {
              d.resolve(data);
            }).error(function(err,status) {
              d.reject(err,status);
            });
        }else{
          $http.get(contextPath + url )
            .success(function (data) {
              d.resolve(data);
            }).error(function(err,status) {
              d.reject(err,status);
            });
        }
      }
      return d.promise;
    },
    post:function(url,params,otherUrl){
      var d = $q.defer();
      //alert('post:' + $rootScope.isOnline);
      if($rootScope.isOnline  == false) {
        $ionicPopup.alert({
          title: "没有可用网络",
          content: "您当前的设备没有接入网络."
        });
      } else {
        if(url=="false"&&otherUrl){
          $http.post(otherUrl, params || {} )
            .success(function (data) {
              alert(data)
              d.resolve(data);
            }).error(function(err,status) {
              d.reject(err,status);
            });
        }else{
          $http.post(contextPath + url , params || {} )
            .success(function (data) {
              d.resolve(data);
            }).error(function(err,status) {
              d.reject(err,status);
            });
        }
      }
      return d.promise;
    }
  };
})
