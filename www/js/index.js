angular.module('starter', ['ionic','ngCordova','homeApp','newWordApp','myApp','commonService','commonDirective','commonFilter'])
  .run(['$ionicPlatform','$rootScope','$ionicHistory','$location','$ionicPopup','$state','ajax','$cordovaNetwork','$timeout',
    function($ionicPlatform,$rootScope,$ionicHistory,$location,$ionicPopup,$state,ajax,$cordovaNetwork,$timeout) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      $state.go("tab.home");
      /*获取设备网络状态开始*/
      /*$timeout(function(){
        $rootScope.network = $cordovaNetwork.getNetwork();
        $rootScope.isOnline = $cordovaNetwork.isOnline();
        console.log($rootScope.network)
        console.log($rootScope.isOnline)
        // listen for Online event,接收$cordovaNetwork:online这一event,执行后面的方法
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          console.log("got online");
          $rootScope.isOnline = true;
          $rootScope.network = $cordovaNetwork.getNetwork();
          $rootScope.$apply();
        })
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          console.log("got offline");
          $rootScope.isOnline = false;
          $rootScope.network = $cordovaNetwork.getNetwork();
          $rootScope.$apply();
        })
      });*/
      /*获取设备网络状态结束*/
      //goback方法定义在$rootScope中,所有的页面都能调用
      $rootScope.goback = function () {
        $ionicHistory.goBack();
      };
      //刚进入页面检查是否有正在播放的听力，没有则返回false
      $rootScope.playing=true;//调试改为true
      //退出页面确认框
      $rootScope.logout=function(){
          var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '您确定要退出应用吗?',
            okText: '退出',
            cancelText: '取消'
          });

          confirmPopup.then(function(res) {
            if (res) {
              //var url = config.logoutUrl + '/sso/rest/logout';
              $http.get(url).success(function(data) {
                ionic.Platform.exitApp();
              }).error(function(error, status) {
                ionic.Platform.exitApp();
              });
            } else {
              // Don't close
            }
          });
      }
      //计算不同设备的fontSize值并插入DOM
      fontSizeSet.setFontSize();
      //注册一个硬件后退按钮动作
      $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        //判断处于哪个页面时双击退出
        if ($location.path() == '/login' || $location.path() == '/tab/home') {
          $rootScope.logout();
        } else if ($ionicHistory.backView()) {
          $ionicHistory.goBack();
        } else {
          // 这是在退出登录页面需要用到
          $rootScope.logout();
        }
        return false;
      }, 101);
      console.log(returnCitySN.cip); //设备ip
      //获取该设备是否进入过引导页的标记
      ajax.get('guide/getFlag?ip='+returnCitySN.cip).then(function(data){
        if(data.success==true){
          var gflag=data.flag;//是否进入过引导页的标记，0表示没进入过
          if(gflag==0){
            $rootScope.guideBox=data.data
            $state.go('guide');
          }else if(gflag==1){
            $state.go('login');
          }
        }else if(data.success==false){
          console.log("出错了！错误信息："+data.msg)
          return
        }
      },function(err,status){
        console.log(err);
        console.log(status);
        console.log("获取数据失败！")
      })
    });
  }])
  //引导页控制器
  .controller('guideCtrl',['ajax','$scope','$state',function(ajax,$scope,$state){
    //跳转到登录页面
    $scope.goLogin=function(){
      //设置该设备已进入过引导页，标记=1
      ajax.get('guide/setFlag?ip='+returnCitySN.cip).then(function(data){
        if(data.success==true&&data.flag==1){
          $state.go('login')
        }else if(data.success==true&&data.flag!=1){
          console.log("设置标记为1失败！")
          return
        }else if(data.success==false){
          console.log("出错了！错误信息："+data.msg)
          return
        }
      },function(err,status){
        console.log(err)
        console.log(status)
        console.log("获取数据失败！")
      })
    }
  }])
  //登录页面控制器
  .controller('loginCtrl',['ajax','$scope','$state','$rootScope','$ionicLoading',function(ajax,$scope,$state,$rootScope,$ionicLoading){
    $scope.user={
      phoneNo:"",
      verifycode:""
    }
    var t;
    var vcode;
    var pOrder=pNull.after(pIncor);//校验手机号
    var cOrder=cNull.after(cIncor);//校验验证码
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    //监听电话号码变化
    $scope.$watch('user.phoneNo',function(newValue,oldValue){
      //电话号码11位时候获取验证码按钮可点击
      if(/^\d{11}$/.test($scope.user.phoneNo)){
        document.getElementById("codeBut").style.backgroundColor="#387ef5";
        $('#codeBut').removeAttr("disabled");
      }else{
        document.getElementById("codeBut").style.backgroundColor="#cccccc";
        $('#codeBut').attr("disabled","disabled");
      }
      //号码变化使得pclear图标出现与消失
      if($scope.user.phoneNo==""||$scope.user.phoneNo==null){
        document.getElementById("pclear").style.display="none"
      }else{
        document.getElementById("pclear").style.display="block"
      }
    })
    //监听验证码是否有值从而决定cclear图标是否出现
    $scope.$watch('user.verifycode',function(newValue,oldValue){
      if($scope.user.verifycode==""||$scope.user.verifycode==null){
        document.getElementById("cclear").style.display="none"
      }else{
        document.getElementById("cclear").style.display="block"
      }
    })
    //清除按钮点击触发函数
    $scope.clear=function(id){
      if(id=="phone"){
        $scope.user.phoneNo=""
      }else if(id=="verifycode"){
        $scope.user.verifycode=""
      }
    }
    //获取验证码
    $scope.getCode=function(){
      if(pOrder($scope.user.phoneNo)==false){
        return
      }
      //设置计时
      var count=20
      function codeCount(){
        if(count==0){
          document.getElementById("codeBut").style.backgroundColor="#387ef5";
          document.getElementById("codeBut").value="重新获取";
          $('#codeBut').removeAttr("disabled");
          clearInterval(t);
        }else{
          document.getElementById("codeBut").style.backgroundColor="#cccccc";
          document.getElementById("codeBut").value=count+"秒";
          $('#codeBut').attr("disabled","disabled");
        }
        count--
      }
      t=setInterval(codeCount,1000);
      //获取验证码的接口
      $scope.postData={
        phone:$scope.user.phoneNo
      };
      ajax.post('login/getcode',$scope.postData).then(function(data){
        //data = Mock.mock(data)
        console.log(data)
        if(data.success==true){
          alert("您的验证码是："+data.verifycode)
          vcode=data.verifycode
          $scope.user.verifycode=data.verifycode
        }else if(data.success==false){
          document.getElementById("errMsg").style.visibility="visible"
          document.getElementById("errMsg").innerHTML=data.msg;
          setTimeout(function(){
            document.getElementById("errMsg").style.visibility="hidden"
          },2000)
          return
        }
      },function(err,status){
        console.log(status)
        console.log(err)
        console.log("获取验证码失败！")
      })
    }
    //登录
    $scope.submit=function(){
      if(pOrder($scope.user.phoneNo)==false){
        return
      }else if(cOrder($scope.user.verifycode,vcode)==false){
        return
      }
      clearInterval(t);//暂停计时
      //post操作
      $scope.postData={
        phone:$scope.user.phoneNo,
        verifycode:$scope.user.verifycode
      };
      ajax.post('login/submit',$scope.postData).then(function(data){
        console.log(data)
        if(data.success==true){
          $scope.userInfo={
            phone:data.data.phoneNumber,
            avatar:data.data.avatar,
            briefIntro:data.data.briefIntro,
            district:data.data.district,
            nickname:data.data.nickname,
            sex:data.data.sex,
            accessToken:data.data.accessToken
          }
          localStorage.setItem("userInfo",JSON.stringify($scope.userInfo));
          $state.go("tab.home");
        }else if(data.success==false){
          document.getElementById("errMsg").style.visibility="visible"
          document.getElementById("errMsg").innerHTML=data.msg;
          setTimeout(function(){
            document.getElementById("errMsg").style.visibility="hidden"
          },2000)
          return
        }
      },function(err,status){
        console.log(status)
        console.log(err)
        console.log("登录失败！")
      })
    }
    //点击"随便看看"触发函数
    $scope.noLogin=function(){
      ajax.get('login/noLogin').then(function(data){
        console.log(data)
        if(data.success==true){
          $scope.userInfo={
            phone:data.data.phoneNumber,
            avatar:data.data.avatar,
            briefIntro:data.data.briefIntro,
            district:data.data.district,
            nickname:data.data.nickname,
            sex:data.data.sex,
            accessToken:data.data.accessToken
          }
          localStorage.setItem("userInfo",JSON.stringify($scope.userInfo))
          $state.go("tab.home");
        }else if(data.success==false){
          document.getElementById("errMsg").style.visibility="visible"
          document.getElementById("errMsg").innerHTML=data.msg;
          setTimeout(function(){
            document.getElementById("errMsg").style.visibility="hidden"
          },2000)
          return
        }
      },function(err,status){
        console.log(status)
        console.log(err)
        console.log("登录失败！")
      })
    }
  }])
