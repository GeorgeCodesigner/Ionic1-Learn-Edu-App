/**
 * Created by chencz on 2017/2/21.
 */
angular.module('newWordApp',[])
  .controller('newWordCtrl',['$scope','$state','ajax','$ionicLoading','$ionicModal','$ionicScrollDelegate','$timeout','$ionicPopup',function($scope,$state,ajax,$ionicLoading,$ionicModal,$ionicScrollDelegate,$timeout,$ionicPopup){
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    //获取生词本数据
    ajax.get('newWord/nwList?accessToken=abc').then(function(data){
      data = Mock.mock(data)
      console.log(data)
      if(data.success==true){
        $scope.nwList=data.data;
        $scope.nwCount=data.data.length;
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    /**
     * 编辑页面模板开始
     */
    $scope.nwEditModalOpen=function(){
      var show=$scope.editModal.show()
      show.then(function(data){
        $ionicScrollDelegate.$getByHandle('nwEditScroll').scrollTop();//为了解决刚进去时候不能往下滑动的问题
        //设置按钮的触摸效果
        for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
          touchEffect.wave(document.getElementsByClassName('touchItem')[i])
        }
      },function(err){
        console.log(err)
      })
    }
    $ionicModal.fromTemplateUrl('templates/newWord/edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editModal = modal;
    })
    //取消编辑按钮,说明没有保存
    $scope.cancel = function() {
      ajax.get('newWord/nwList?accessToken=abc').then(function(data){
        data = Mock.mock(data)
        console.log(data)
        if(data.success==true){
          $scope.nwList=data.data;
          $scope.nwCount=data.data.length;
        }
        $scope.editModal.hide();
      },function(err,status){
        console.log(status)
        console.log(err)
        console.log("获取数据失败！")
      })
    };
    //清除一条生词记录所调用的方法
    $scope.clearItem=function(index){
      console.log(index)
      $scope.nwList.splice(index,1)
      $scope.nwCount= $scope.nwList.length
    }
    //添加一条生词记录调用的方法
    $scope.addInput=function(){
      if($scope.nwList[$scope.nwCount-1].chinese==""||$scope.nwList[$scope.nwCount-1].english==""){
        var alertPopup = $ionicPopup.alert({
          title: '注意',
          template: '存在空的生词记录！'
        });
        alertPopup.then(function(res) {
          //do something
        });
        return
      }
      $scope.nwList.push({
        chinese:"",
        english:""
      })
      console.log($scope.nwList)
      $scope.nwCount= $scope.nwList.length;
      $timeout(function(){
        console.log($scope.nwCount)
        //$ionicScrollDelegate.$getByHandle('nwEditScroll').scrollBottom();
        for(var i=0;i<$scope.nwCount;i++){
          document.getElementsByClassName("editChi")[i].blur();
        }
        document.getElementsByClassName("editChi")[$scope.nwCount-1].focus();
      })
    }
    //输入框聚焦调用的方法
    $scope.nwiFocus=function(index){
      for(var i=0;i<document.getElementsByClassName("nwEditItem").length;i++){
        document.getElementsByClassName("nwEditItem")[i].style.borderBottom="1px solid gray"
      }
      document.getElementsByClassName("nwEditItem")[index].style.borderBottom="1px solid rgba(56,126,245,1)"
    }
    //输入框失焦调用的方法
    $scope.nwiBlur=function(index){
      document.getElementsByClassName("nwEditItem")[index].style.borderBottom="1px solid gray"
    }
    //完成编辑按钮
    $scope.save=function(){

    }
    /**
     * 编辑资料页面模板结束
     */
    /**
     * 学习页面模板开始
     */
    $scope.curIndex=0;//初始学习卡片序号是0
    $scope.preIndex;//前一位序号
    $scope.nextIndex;//后一位序号
    $scope.nwLearnModalOpen=function(){
      var show=$scope.learnModal.show()
      show.then(function(data){
        //设置按钮的触摸效果
        for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
          touchEffect.wave(document.getElementsByClassName('touchItem')[i])
        }
      },function(err){
        console.log(err)
      })
    }
    $ionicModal.fromTemplateUrl('templates/newWord/learn.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.learnModal = modal;
    })
    //关闭按钮点击触发函数
    $scope.closeLearn=function(){
      $scope.learnModal.hide()
    }
    //前面卡片出现调用函数
    $scope.preCard=function(){
      document.getElementsByClassName("nwlCardFontCur")[0].className="nwlCardFontCur slideOutRight"
      document.getElementsByClassName("nwlcfLeftIn")[0].className="nwlcfLeftIn slideInLeft"
      if($scope.curIndex==0){
        $scope.preIndex=$scope.nwList.length-1;
      }else{
        $scope.preIndex=$scope.curIndex-1
      }
      $timeout(function(){
        $scope.curIndex=$scope.preIndex;
        console.log("curIndex:"+$scope.curIndex)
        document.getElementsByClassName("nwlCardFontCur")[0].className="nwlCardFontCur"
        document.getElementsByClassName("nwlcfLeftIn")[0].className="nwlcfLeftIn"
      },3000)
      console.log("preIndex:"+$scope.preIndex)
    }
    //后面卡片出现调用函数
    $scope.nextCard=function(){
      document.getElementsByClassName("nwlCardFontCur")[0].className="nwlCardFontCur slideOutLeft"
      document.getElementsByClassName("nwlcfRightIn")[0].className="nwlcfRightIn slideInRight"
      if($scope.curIndex==$scope.nwList.length-1){
        $scope.nextIndex=0;
      }else{
        $scope.nextIndex=$scope.curIndex+1
      }
      $timeout(function(){
        $scope.curIndex=$scope.nextIndex;
        console.log("curIndex:"+$scope.curIndex)
        document.getElementsByClassName("nwlCardFontCur")[0].className="nwlCardFontCur"
        document.getElementsByClassName("nwlcfRightIn")[0].className="nwlcfRightIn"
      },3000)
      console.log("nextIndex:"+$scope.nextIndex)
    }
    /**
     * 学习页面模板结束
     */
    //发音按钮点击调用函数
    $scope.sound=function(index){
      console.log("第"+index+"个词发音")
    }
    //向左滑动进入我的页面
    $scope.onSwipeLeft=function(){
      $state.go('tab.my')
    }
    //向右滑动进入发现页面
    $scope.onSwipeRight=function(){
      $state.go('tab.home')
    }
  }])
