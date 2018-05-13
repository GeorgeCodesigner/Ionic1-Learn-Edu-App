/**
 * Created by chencz on 2017/2/21.
 */
angular.module('homeApp',['commonService'])
  .controller('homeCtrl',['$scope','$state','$rootScope','$window','$ionicSlideBoxDelegate','$timeout','ajax','$ionicScrollDelegate','$ionicLoading',function($scope,$state,$rootScope,$window,$ionicSlideBoxDelegate,$timeout,ajax,$ionicScrollDelegate,$ionicLoading){
      $scope.hotData=[];//存放热门部分的数据（始终只存放当前hot_index列表往前减20（总共30条数据）的列表，其余的列表存放在aheadSave和curSave中）
      $scope.aheadSave=[];//往后滑动时，保存暂时不需要当前hot_index往前的列表
      $scope.curSave=[];//往前滑动时，保存暂时不需要当前hot_index的列表
      var flag=false;//标记是否离开过home页面，一旦离开过flag就设置为true
      var hot_index=0;//记录热门部分数据获取的次数（当前次数）
      var sr_sepa=0;//多获取数据滑动的分界点
      //向左滑动进入词汇页面
      $scope.onSwipeLeft=function(){
        $state.go('tab.newWord')
      }
      //设置轮播图的更新与循环
      var slideTime=$timeout(function(){
        $ionicSlideBoxDelegate.$getByHandle('sliderBan').update();//轮播模块更新
        $ionicSlideBoxDelegate.$getByHandle('sliderBan').loop(true);//循环
      },3000)
      //页面切换保证轮播图正常自动循环
      $scope.$on('$ionicView.enter',function(){
        if(flag){
          $ionicSlideBoxDelegate.next();//轮播模块自动进入下一个
        }
      })
      $scope.$on('$ionicView.leave',function(){
        $timeout.cancel(slideTime);//切换页面时取消$timeout
        flag=true
      })
      //跳转到全部的最新部分页面
      $scope.goAllNew=function(){
        console.log("跳转到全部的最新部分页面")
        //$state.go()
      }
      /*//跳转到全部的热门部分页面
      $scope.goAllHot=function(){
        console.log("跳转到全部的热门部分页面")
        //$state.go()
      }*/
      //先显示加载指示器，数据获取完再隐藏
      $ionicLoading.show({ //加载指示器显示
        noBackdrop: true,
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });
      //一次性获取所有数据
        ajax.get('home/content?accessToken=abc').then(function(data){
          data = Mock.mock(data)
          //console.log(data)
          if(data.success==true){
            console.log("一次性获取所有数据")
            $timeout(function() { //典型的任务队列，先把其他数据获取好，再获取slideBox的数据
              $scope.slideBox=data.slidebox_data;
              $ionicSlideBoxDelegate.$getByHandle('sliderBan').update();//轮播模块更新
              $ionicSlideBoxDelegate.$getByHandle('sliderBan').loop(true);//循环
              $ionicLoading.hide()
            });
            $scope.newData=data.newPart_data;
            //console.log("第一次获取热门部分的数据")
            for(var i=0;i<data.hot_data.length;i++){
              data.hot_data[i].index=i;
              $scope.hotData.push(data.hot_data[i])//先获取10条数据
            }
            hot_index++;
            console.log($scope.hotData)
            //跳转到相应的最新部分详情页
            $scope.goNewDet=function(index){
              var type=$scope.newData[index].type;
              var title=$scope.newData[index].title;
              $window.location.href = '#home/newDetail/'+type+'/'+title;
            }
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
      /*
       * 下拉刷新部分开始
      */
      var move_dis=0;//滑动距离,默认是0
      var start_dis;//开始滑动的点
      var refresh_d;//滚动条距顶部的距离
      //刷新图标消失调用函数
      function refreshHide(){
        document.getElementById("refresh").style.top="-1.1rem";
        document.getElementById("refresh").style.transition="top 0.5s linear";
        document.getElementById("refresh").style.WebkitTransition="top 0.5s linear";
        setTimeout(function(){
          document.getElementById("refresh").removeAttribute("style");
          document.getElementById("refreshCont").removeAttribute("style");
          document.getElementById("refreshCont").removeAttribute("class");
        },500)
      }

      if(window.addEventListener){
        //触摸开始调用的函数
        document.getElementsByClassName("homeContent")[0].addEventListener('touchstart',function(event){
          //console.log("触摸开始")
          refresh_d=$ionicScrollDelegate.$getByHandle('homeScroll').getScrollPosition().top;
          start_dis=event.changedTouches[0].clientY;
        })
        //触摸滑动中调用的函数
        document.getElementsByClassName("homeContent")[0].addEventListener('touchmove',function(event){
          //console.log("触摸滑动中")
          move_dis=event.touches[0].clientY-start_dis;
          refreshShow(move_dis,refresh_d)//显示下拉刷新图片
        })
        //触摸结束调用的函数
        document.getElementsByClassName("homeContent")[0].addEventListener('touchend',function(event){
          //console.log("触摸结束")
          //console.log(refresh_d)
          if(move_dis>=0&&move_dis<=3*fontSize&&refresh_d==0){
            refreshHide()
          }else if(move_dis>3*fontSize&&refresh_d==0){ //开始刷新
            document.getElementById("refreshCont").setAttribute("class","infiRotate");//图标无限旋转
            ajax.get('home/content?accessToken=abc').then(function(data){
              data = Mock.mock(data)
              //console.log(data)
              if(data.success==true){
                console.log("一次性获取所有数据")
                $timeout(function() { //典型的任务队列，先把其他数据获取好，再获取slideBox的数据
                  $scope.slideBox=data.slidebox_data;
                  $ionicSlideBoxDelegate.$getByHandle('sliderBan').update();//轮播模块更新
                  $ionicSlideBoxDelegate.$getByHandle('sliderBan').loop(true);//循环
                });
                $ionicScrollDelegate.$getByHandle('newScroll').scrollTop();//最新部分滑动到初始位置
                $scope.newData=data.newPart_data;
                $scope.hotData=[];
                $scope.aheadSave=[];
                $scope.curSave=[];
                hot_index=0;
                sr_sepa=0;
                move_dis=0;
                console.log("第一次获取热门部分的数据")
                for(var i=0;i<data.hot_data.length;i++){
                  data.hot_data[i].index=i;
                  $scope.hotData.push(data.hot_data[i])//先获取10条数据
                }
                hot_index++;
                console.log($scope.hotData)
              }
              refreshHide()
              event.stopPropagation()
            },function(err,status){
              console.log(status)
              console.log(err)
              console.log("获取数据失败！")
              refreshHide()
            })
          }else{
            //console.log("没有刷新")
          }
        })
      }else if(window.attachEvent){
        //触摸开始调用的函数
        document.getElementsByClassName("homeContent")[0].attachEvent('ontouchstart',function(event){
          //console.log("触摸开始")
          refresh_d=$ionicScrollDelegate.$getByHandle('homeScroll').getScrollPosition().top;
          start_dis=event.changedTouches[0].clientY;
        })
        //触摸滑动中调用的函数
        document.getElementsByClassName("homeContent")[0].attachEvent('ontouchmove',function(event){
          //console.log("触摸滑动中")
          move_dis=event.touches[0].clientY-start_dis;
          refreshShow(move_dis,refresh_d)//显示下拉刷新图片
        })
        //触摸结束调用的函数
        document.getElementsByClassName("homeContent")[0].attachEvent('ontouchend',function(event){
          //console.log("触摸结束")
          //console.log(move_dis)
          if(move_dis>0&&move_dis<=3*fontSize&&refresh_d==0){
            refreshHide()
          }else if(move_dis>3*fontSize&&refresh_d==0){ //开始刷新
            document.getElementById("refreshCont").setAttribute("class","infiRotate");//图标无限旋转
            ajax.get('home/content?accessToken=abc').then(function(data){
              data = Mock.mock(data)
              console.log(data)
              if(data.success==true){
                console.log("一次性获取所有数据")
                $timeout(function() { //典型的任务队列，先把其他数据获取好，再获取slideBox的数据
                  $scope.slideBox=data.slidebox_data;
                  $ionicSlideBoxDelegate.$getByHandle('sliderBan').update();//轮播模块更新
                  $ionicSlideBoxDelegate.$getByHandle('sliderBan').loop(true);//循环
                });
                $ionicScrollDelegate.$getByHandle('newScroll').scrollTop();//最新部分滑动到初始位置
                $scope.newData=data.newPart_data;
                $scope.hotData=[];
                $scope.aheadSave=[];
                $scope.curSave=[];
                hot_index=0;
                sr_sepa=0;
                console.log("第一次获取热门部分的数据")
                for(var i=0;i<data.hot_data.length;i++){
                  data.hot_data[i].index=i;
                  $scope.hotData.push(data.hot_data[i])//先获取10条数据
                }
                hot_index++;
                console.log($scope.hotData)
              }
              refreshHide()
            },function(err,status){
              console.log(status)
              console.log(err)
              console.log("获取数据失败！")
              refreshHide()
            })
          }else{
            //console.log("没有刷新")
          }
        })
      }
      //显示下拉刷新图片的函数定义
      function refreshShow(distance,refresh_d){
        //console.log(distance)
        //console.log(refresh_d)
        if(distance<=0||refresh_d!=0){
          //console.log("没有刷新")
        }else if(distance>0&&distance<=3*fontSize&&refresh_d==0){ //还在下拉中，未刷新
          document.getElementById("refresh").style.top=-1.1*fontSize+distance+"px";
          if(distance<=2*fontSize){
            document.getElementById("refreshIcon").style.opacity=1-(2*fontSize-distance)/100;
          }else{
            document.getElementById("refreshIcon").style.opacity=1;
          }
          document.getElementById('refreshCont').style.WebkitTransform="rotate("+(distance*360/(3*fontSize))+"deg)";
          document.getElementById('refreshCont').style.transform="rotate("+(distance*360/(3*fontSize))+"deg)";
        }else if(distance>3*fontSize&&refresh_d==0){
          document.getElementById("refresh").style.top=1.9*fontSize+"px";
          document.getElementById("refreshIcon").style.opacity=1;
        }
      }
      /*
       * 下拉刷新部分结束
       */
      /*
       *监听滚动条向下滚动事件:导致头部背景变化、加载最新部分更多的列表数据 开始
       */
      document.getElementsByClassName("homeContent")[0].onscroll = function() {
        var scroll_d=$ionicScrollDelegate.$getByHandle('homeScroll').getScrollPosition().top;
        //console.log(scroll_d)
        headChange(scroll_d) //导致头部背景变化函数调用
      };
      //导致头部背景变化函数定义
      function headChange(distance){
        //distance=0是开始，distance=150(3rem)是结束
        if(distance<=0){
          document.getElementsByClassName('headerContain')[0].style.backgroundColor="transparent"
        }else if(distance<=3*fontSize&&distance>0){
          var opacity=distance/(3*fontSize);
          document.getElementsByClassName('headerContain')[0].style.backgroundColor="rgba(56,126,245,"+opacity+")";
        }else{
          document.getElementsByClassName('headerContain')[0].style.backgroundColor="rgba(56,126,245,1)";
        }
      }
      //往前滑动:释放$scope.aheadSave和写入$scope.curSave的函数定义
      //往后滑动:加载最新部分更多的列表数据函数定义以及释放$scope.curSave和写入$scope.aheadSave的函数定义
      $scope.HListChange=function(){
        var scroll_d=$ionicScrollDelegate.$getByHandle('homeScroll').getScrollPosition().top;
        console.log(hot_index)
        console.log(scroll_d)
        //第一次多获取10条数据
        if(scroll_d/fontSize>=10&&hot_index==1){
          console.log("到点1")
          $ionicLoading.show({ //加载指示器显示
            noBackdrop: true,
            template: '<ion-spinner icon="bubbles"></ion-spinner>'
          });
          ajax.get('home/hot?accessToken=abc').then(function(data){
            console.log("请求新的数据")
            data = Mock.mock(data)
            if(data.success==true&&data.total){
              for(var i=0;i<data.total;i++){
                data.data[i].index=i+10*hot_index;
                $scope.hotData.push(data.data[i])
              }
              hot_index++;
              console.log(hot_index)
              console.log($scope.hotData)
              sr_sepa=scroll_d;
            }
            $ionicLoading.hide();//加载指示器隐藏
          },function(err,status){
            console.log(status)
            console.log(err)
            console.log("获取数据失败！")
            $ionicLoading.hide();//加载指示器隐藏
          })
        }
        //第二到n次多获取10条数据 和 往后滑动释放$scope.curSave和写入$scope.aheadSave
        else if(hot_index>1&&((scroll_d-sr_sepa+10)/(15*fontSize)>=1)){
          console.log("到点2以上的")
          console.log("sr_sepa:"+sr_sepa)
          if(hot_index>3&&$scope.curSave.length>0){ //往后滑动释放$scope.curSave和写入$scope.aheadSave的情况
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTo(0,scroll_d-15*fontSize+10);
            for(i=0;i<10;i++){
              $scope.hotData.push($scope.curSave.shift())
              $scope.aheadSave.push($scope.hotData.shift())
            }
            console.log($scope.hotData)
            console.log($scope.aheadSave)
            console.log($scope.curSave)
          }else{ //需要加载新的数据的情况
            ajax.get('home/hot?accessToken=abc').then(function(data){
              console.log("请求新的数据")
              $ionicLoading.show({ //加载指示器显示
                noBackdrop: true,
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
              });
              data = Mock.mock(data)
              if(data.success==true&&data.total){
                for(i=0;i<data.total;i++){
                  data.data[i].index=i+10*hot_index;
                  $scope.hotData.push(data.data[i])//多获取10条数据
                }
                hot_index++;
                console.log(hot_index)
                if(hot_index>3){
                  $ionicScrollDelegate.$getByHandle('homeScroll').scrollTo(0,scroll_d-15*fontSize+10);
                  for(i=0;i<10;i++){
                    $scope.aheadSave.push($scope.hotData.shift())
                  }
                }else{
                  sr_sepa=scroll_d;
                }
                console.log($scope.hotData)
                console.log($scope.aheadSave)
                console.log($scope.curSave)
              }
              $ionicLoading.hide();//加载指示器隐藏
            },function(err,status){
              console.log(status)
              console.log(err)
              console.log("获取数据失败！")
              $ionicLoading.hide();//加载指示器隐藏
            })
          }
        }
        //往前滑动:释放$scope.aheadSave和写入$scope.curSave
        else if($scope.aheadSave.length>0&&sr_sepa-scroll_d>=13*fontSize&&scroll_d>7.96*fontSize){
          console.log("倒退到点了！")
          $ionicScrollDelegate.$getByHandle('homeScroll').scrollTo(0,sr_sepa);
          for(i=0;i<10;i++){
            $scope.hotData.unshift($scope.aheadSave.pop())
            $scope.curSave.unshift($scope.hotData.pop())
          }
          console.log($scope.hotData)
          console.log($scope.aheadSave)
          console.log($scope.curSave)
        }
        //往前滑动超出前一个的范围，但是又没滑到头
        else if($scope.aheadSave.length>0&&scroll_d<=7.96*fontSize){
          console.log("滑太快了，需要全部释放$scope.aheadSave和写入$scope.curSave")
          console.log("$scope.aheadSave.length:"+$scope.aheadSave.length)
          $scope.$apply(function(){
            while($scope.aheadSave.length>0){
              $scope.hotData.unshift($scope.aheadSave.pop())
            }
            console.log("$scope.hotData.length:"+$scope.hotData.length)
            while($scope.hotData.length>30){
              $scope.curSave.unshift($scope.hotData.pop())
            }
            console.log($scope.hotData)
            console.log($scope.aheadSave)
            console.log($scope.curSave)
          })
        }
      }
    /*
     *监听滚动条向下滚动事件:导致头部背景变化、加载最新部分更多的列表数据 结束
     */
      //点击搜索按钮跳到搜索页
      $scope.goSearch=function(){
        $state.go('tab.home-search')
      }
      //跳到正在播放的界面
      $scope.goPlaying=function(){
        if($rootScope.playing){
          $window.location.href = '#playing/news/110';
        }else{
          //$state.go('')
        }
      }
      //点击分类按钮跳到分类页
      $scope.goClassify=function(){
        $state.go('tab.home-classify')
      }
  }])
  /*分类页面控制器
   */
  .controller('classifyCtrl',['$scope','ajax','$ionicLoading',function($scope,ajax,$ionicLoading){
      $scope.type="实用日语"
      $scope.typeShow=[true,false]
      $scope.difShow=[true,false]
      $scope.popSort=[0,0]
      $scope.popOrder=""
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    //听力类型选项点击触发函数
    $scope.tShow=function(){
      if($scope.typeShow[0]==true){
        $scope.typeShow=[false,true]
      }else{
        $scope.typeShow=[true,false]
      }
    }
    //听力难度选项点击触发函数
    $scope.dShow=function(){
      if($scope.difShow[0]==true){
        $scope.difShow=[false,true]
      }else{
        $scope.difShow=[true,false]
      }
    }
    //人气选项点击触发函数
    $scope.popChan=function(){
      if($scope.popSort[0]==1&&$scope.popSort[1]==0){
        $scope.popSort=[0,1];
        $scope.popOrder = "-pop";//降序
      }else{
        $scope.popSort=[1,0];
        $scope.popOrder = "pop";//升序
      }
    }
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    //获取默认搜索数据
    ajax.get('classify?accessToken=abc').then(function(data){
      data = Mock.mock(data)
      //console.log(data)
      if(data.success==true){
        $scope.classifyData=data.data
        console.log($scope.classifyData)
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
  }])
  /*搜索页控制器
  * */
  .controller('searchCtrl',['$scope','ajax','$ionicLoading',function($scope,ajax,$ionicLoading){
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    $scope.keyword="";
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    //获取默认搜索数据
    ajax.get('search?accessToken=abc').then(function(data){
      data = Mock.mock(data)
      //console.log(data)
      if(data.success==true){
        $scope.searchData=data.data
        console.log($scope.searchData)
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
    //取消按钮的操作
    $scope.cancel=function(){
      $scope.keyword="";
    }
  }])
  /*"最新"部分节目详情页控制器
  * */
  .controller('newDetailCtrl',['$scope','ajax','$stateParams','$ionicModal','$ionicLoading','$ionicScrollDelegate','$timeout',function($scope,ajax,$stateParams,$ionicModal,$ionicLoading,$ionicScrollDelegate,$timeout){
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    console.log($stateParams.type)
    console.log($stateParams.title)
    $scope.showOrder=0;//默认显示高到低排序的图标
    $scope.volumeOrder="-volume";//默认从高到低排序
    $scope.dlCount=0;//统计有多少个需要下载的列表的节目
    //$scope.subFlag="订阅"
    //根据不同的$stateParams.index动态添加订阅按钮事件和滑动事件
    $scope.$on('$ionicView.beforeEnter',function(){
      //console.log(document.getElementsByClassName("newDetCon")[1])
      if(document.getElementsByClassName("newDetCon")[1]){
        document.getElementsByClassName("newDetCon")[1].parentNode.removeChild(document.getElementsByClassName("newDetCon")[0]);
      }

      //滑动触发样式变化函数
      document.getElementsByClassName("newDetailCont")[0].onscroll = function() {
        //console.log($(".newdetail-choose").offset().top)
        moveNewdetail($(".newdetail-choose").offset().top)
      }
    })
    //排序图标点击触发事件
    $scope.orderList=function(){
      if($scope.showOrder==0){
        $scope.volumeOrder="volume";
        $scope.showOrder=1
      }else if($scope.showOrder==1){
        $scope.volumeOrder="-volume";
        $scope.showOrder=0
      }
    }
    function moveNewdetail(distance){
      //distance=169(3.38rem)是开始，distance=44(0.88rem)是结束
      if(distance>=3.38*fontSize){
        document.getElementById('newdetail-total').style.WebkitTransform="scale(1,1)";
        document.getElementById('newdetail-total').style.transform="scale(1,1)";
        document.getElementById('newdetail-total').style.opacity=1;
        document.getElementsByClassName("newdetail-header")[0].style.backgroundColor="transparent";
      }else if(distance<3.38*fontSize&&distance>=0.88*fontSize){
        var sando=1-(3.38*fontSize-distance)/(2.5*fontSize);//size and opacity
        document.getElementById('newdetail-total').style.WebkitTransform="scale("+sando+","+sando+")";
        document.getElementById('newdetail-total').style.transform="scale("+sando+","+sando+")";
        document.getElementById('newdetail-total').style.opacity=sando;
        document.getElementsByClassName("newdetail-header")[0].style.backgroundColor="transparent";
      }else{
        document.getElementById('newdetail-total').style.WebkitTransform="scale(0,0)";
        document.getElementById('newdetail-total').style.transform="scale(0,0)";
        document.getElementById('newdetail-total').style.opacity=0;
        document.getElementsByClassName("newdetail-header")[0].style.backgroundColor="rgba(56,126,245,1)";
      }
    }
    //获取详情列表需要的数据
    $scope.postData={
      type:$stateParams.type,
      title:$stateParams.title,
      accessToken:"abc"
    }
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    ajax.post('home/newDetail',$scope.postData).then(function(data){
      data = Mock.mock(data)
      console.log(data)
      if(data.success==true){
        $scope.totalTitle=$stateParams.title;
        $scope.briefIntro=data.briefIntro;
        $scope.subFlag=data.subFlag;
        $timeout(function(){
          console.log($scope.subFlag)
          //订阅按钮点击触发函数
          document.getElementsByClassName("subscribe")[0].onclick=function(){
            if($scope.subFlag=="订阅"){
              document.getElementsByClassName("subscribe")[0].innerHTML="取消订阅";
              $scope.subFlag="取消订阅"
            }else{
              document.getElementsByClassName("subscribe")[0].innerHTML="订阅";
              $scope.subFlag="订阅"
            }
          }
        })
        $scope.totalList=data.totalList;
        $scope.detailItem=data.data;
        $scope.dlFlag=dictionary.create();//存放列表节目是否是选中要下载的状态
        //每一个刚开始都是未下载的状态
        for(var j=0;j<$scope.totalList;j++){
          var titleStr=$scope.detailItem[j].title
          dictionary.put(titleStr,0)
        }
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
    //单例模式实现幕布和弹窗创建
    var maskSingle=getSingle(mask);//管理mask单例
    var shareSingle=getSingle(shareModal);//管理分享弹窗单例
    $scope.shareOpen=function(){ //
      var mask=maskSingle();//创建mask单例对象
      var share=shareSingle();//创建分享弹窗单例对象
      mask.style.display="block";//设置mask的属性
      share.setAttribute("class","showUp")//给share添加向上出现的动画
      share.style.bottom="0";//设置share的属性
      mask.onclick=function(e){ //mask点击隐藏自身
        share.setAttribute("class","showDown")//给share添加向下退出的动画
        share.style.bottom="-100%";//设置share的属性
        mask.style.display="none";
        e.stopPropagation();
      }
    }
    //"下载"按钮点击触发的函数
    $scope.singleDl=function(item,mark){
      $scope.dlChoose(item,mark)
      var show=$scope.downlModal.show()
      show.then(function(data){
        $ionicScrollDelegate.$getByHandle('batchScroll').scrollTop();//为了解决刚进去时候不能往下滑动的问题
        //设置按钮的触摸效果
        for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
          touchEffect.wave(document.getElementsByClassName('touchItem')[i])
        }
      },function(err){
        console.log(err)
      })
    }
    /**
     * 批量下载页面模版开始
     */
    $scope.sizeOrder="-size";//默认根据每条节目大小从大到小排序
    $scope.batchOrder=0;//默认显示大到小排序的图标
    //排序按钮点击操作
    $scope.orderBatch=function(){
      if($scope.batchOrder==0){
        $scope.sizeOrder="size";
        $scope.batchOrder=1
      }else if($scope.batchOrder==1){
        $scope.sizeOrder="-size";
        $scope.batchOrder=0
      }
    }
    //点击节目列表前面的选择按钮触发的函数
    $scope.dlChoose=function(obj,mark){
      var count=0;
      console.log(obj)
      var index;
      for(index in $scope.detailItem){
        if(obj==$scope.detailItem[index]){
          console.log(index)
          console.log($scope.dlFlag[obj.title])
          if($scope.dlFlag[obj.title]==0){
            $scope.dlFlag[obj.title]=1
          }else{
            if(mark==true){
              $scope.dlFlag[obj.title]=1
            }else{
              $scope.dlFlag[obj.title]=0
            }
          }
          break
        }
      }
      console.log($scope.dlFlag)
      //统计选择要下载的个数
      for(var j=0;j<$scope.totalList;j++){
        var countStr=$scope.detailItem[j].title
        if($scope.dlFlag[countStr]==1){
          count+=1
        }
      }
      $scope.dlCount=count;
    }
    //"全选"按钮点击触发事件
    $scope.batchAll=function(){
      var count=0;
      var index;
      for(index in $scope.detailItem){
        var obj=$scope.detailItem[index]
        $scope.dlFlag[obj.title]=1
      }
      console.log($scope.dlFlag)
      //统计选择要下载的个数
      $scope.dlCount=$scope.detailItem.length;
    }
    //打开批量下载页面模版
    $scope.batchDown=function(){
      var show=$scope.downlModal.show()
      show.then(function(data){
        $ionicScrollDelegate.$getByHandle('batchScroll').scrollTop();//为了解决刚进去时候不能往下滑动的问题
      },function(err){
        console.log(err)
      })
    }
    $ionicModal.fromTemplateUrl('templates/home/batchDown.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.downlModal = modal;
    })
    //关闭批量下载页面模版
    $scope.cancelBatch=function(){
      $scope.downlModal.hide()
    }
    /**
     * 批量下载页面模版结束
     */
  }])
  /*正在播放页面控制器
  * */
  .controller('playingCtrl',['$scope','$stateParams','$ionicPopover','ajax','$timeout','$cordovaFileTransfer','$ionicLoading',function($scope,$stateParams,$ionicPopover,ajax,$timeout,$cordovaFileTransfer,$ionicLoading){
    var textsplit;//存放分割后的每个词
    var tc;//分割后的词变成button连接成的字符串
    var tsLen=[];//存放textsplit的长度的数组
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    //console.log($stateParams.type)
    //console.log($stateParams.id)
    /*操作弹窗的控制开始*/
    var template = '<ion-popover-view class="popPart">'+
      '<ion-content style="margin: 0;"><ion-list style="text-align: center;">'+
      '<ion-item ng-click="">'+'播放设置'+'</ion-item>'+
      '<ion-item ng-click="">'+'定时关闭'+'</ion-item>'+
      '<ion-item ng-click="download(audioUrl)">'+'下载'+'</ion-item>'+
      '<ion-item ng-click="">'+'分享'+'</ion-item>'+
      '</ion-list></ion-content>'+
      '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.operateOpen = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    /*操作弹窗的控制结束*/
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    //获取测试文本数据
    ajax.get('playing?accessToken=abc').then(function(data){
      data = Mock.mock(data)
      if(data.success==true){
        $scope.contentData=data.data;//文本内容
        $scope.title=data.title;//文本标题
        $scope.total=data.total;//文本总段数
        $scope.audioUrl=data.url;//音频服务器URL下载地址
        //动态增加文本内容
        var content=$("#audioCont")
        for(var j=0;j<$scope.total;j++){
          textsplit=[];
          tc="";
          textsplit=$scope.contentData[j].content.split(" ")
          //console.log(textsplit)
          for(var i=0;i<textsplit.length;i++){
            tc+='<button id="ts_'+j+'_'+i+'">'+textsplit[i]+'</button>'+' ';
          }
          //console.log(tc)
          content.append('<li id="item'+j+'">'+tc+'</li>');
          tsLen[j]=textsplit.length
          //content.append('<li id="item'+j+'">'+$scope.contentData[j].content+'</li>');
        }
        //设置文本随音频变化的状态
        var stateObj={
          total:$scope.total,
          audioUrl:$scope.audioUrl
        }
        setActive(stateObj)
        //设置选词事件触发的状态
        chooseWord($scope.total,tsLen)
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
    //选词事件触发的函数
    function chooseWord(total,tsLen){
      for(var j=0;j<total;j++){
        for(var i=0;i<tsLen[j];i++){
          (function(j,i){ //利用闭包
            var id="ts_"+j+'_'+i;
            document.getElementById(id).onclick=function(){
              //选择词后的样式
              $("#audioCont button").css("backgroundColor","transparent")//所有词背景先全部置为透明
              document.getElementById(id).style.backgroundColor="rgba(56, 126, 245,0.3)"
              var tsplit=document.getElementById(id).innerHTML //存放选中的文本内容
              //文本内容如果有标点符号就需要删去
              if(tsplit.indexOf(".")!=-1||tsplit.indexOf(",")!=-1||tsplit.indexOf("。")!=-1||tsplit.indexOf("，")!=-1||tsplit.indexOf("、")!=-1){
                tsplit=tsplit.replace(".","")||tsplit.replace(",","")||tsplit.replace("。","")||tsplit.replace("，","")||tsplit.replace("、","")
              }
              document.getElementById("wordExpBox").style.display="block";
              //单词解释部分的设置
              if(document.getElementById("wtitleBox")){ //如果原本就有<div id="wtitleBox">节点，直接替换
                document.getElementById("wtitleBox").innerHTML=
                  '<span class="wtitle1">'+tsplit+'</span>'+
                  '<span class="wtitle2">haha</span>'+
                  '<span class="wtitle3">heihei</span>';
              }else{ //不存在<div id="wtitleBox">节点，就生成并设置单词解释框
                var wtitleBox=document.createElement("div");
                wtitleBox.setAttribute("id","wtitleBox");
                wtitleBox.innerHTML=
                  '<span class="wtitle1">'+tsplit+'</span>'+
                  '<span class="wtitle2">haha</span>'+
                  '<span class="wtitle3">heihei</span>';
                document.getElementById("wordExpBox").appendChild(wtitleBox);
              }
            }
          })(j,i)
        }
      }
    }
    //关闭单词解释框
    $scope.closeExp=function(){
      document.getElementById("wordExpBox").style.display="none";
      $("#audioCont button").css("backgroundColor","transparent")
    }
    //设置文本随音频变化的状态调用函数
    function setActive(obj){
        $scope.$broadcast('totalCount',obj)//向子控制器：audioPlayer的控制器传递参数
    }
    //下载按钮触发事件
    $scope.download=function(audioUrl){
      var url = audioUrl;
      //var targetPath = cordova.file.externalRootDirectory + "/audioPlaying.mp3";
      var targetPath = "cdvfile://localhost/persistent/path/to/audio.mp3";
      var trustHosts = true;
      var options = {};
      console.log(targetPath)
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function (result) {
          console.log("下载成功：" + result)
          $scope.popover.hide();
        }, function (err) {
          console.log("下载失败！")
        }, function (progress) {
          //$timeout(function () {
          //  return downloadProgress = (progress.loaded / progress.total) * 100;
          //});
        });
    }
  }])
