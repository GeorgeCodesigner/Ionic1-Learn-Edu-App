/**
 * Created by chencz on 2017/2/21.
 */
angular.module('myApp',[])
  .controller('myCtrl',['$scope','$state','ajax','$ionicModal','$ionicPopup','$cordovaImagePicker','$cordovaFileTransfer','$ionicActionSheet','$cordovaCamera','$ionicScrollDelegate','$ionicLoading',function($scope,$state,ajax,$ionicModal,$ionicPopup,$cordovaImagePicker,$cordovaFileTransfer,$ionicActionSheet,$cordovaCamera,$ionicScrollDelegate,$ionicLoading){
    $scope.userInfo=JSON.parse(localStorage.getItem("userInfo"))//从localStorage里面取出用户信息
    console.log($scope.userInfo)
    //设置按钮的触摸效果
    for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
      touchEffect.wave(document.getElementsByClassName('touchItem')[i])
    }
    //向右滑动进入词汇页面
    $scope.onSwipeRight=function(){
      $state.go('tab.newWord')
    }
    /**
     * 编辑资料页面模板开始
     */
    $scope.editModalOpen=function(){
      var show=$scope.editModal.show()
      show.then(function(data){
        $ionicScrollDelegate.$getByHandle('editScroll').scrollTop();//为了解决刚进去时候不能往下滑动的问题
        //设置按钮的触摸效果
        for(var i=0;i<document.getElementsByClassName('touchItem').length;i++){
          touchEffect.wave(document.getElementsByClassName('touchItem')[i])
        }
      },function(err){
        console.log(err)
      })
    }
    $ionicModal.fromTemplateUrl('templates/my/edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editModal = modal;
    })
    //取消编辑按钮
    $scope.cancel = function() {
      $scope.editModal.hide();
    };
    $scope.ischoosex=[true,false];//默认状态
    //sex=0代表男，sex=1代表女
    $scope.choosem=function(){
      $scope.ischoosex=[true,false];
      $scope.userInfo.sex=0;
    }
    $scope.choosefm=function(){
      $scope.ischoosex=[false,true];
      $scope.userInfo.sex=1;
    }
    //更换头像按钮点击触发的函数
    function createMask(){
      var ret=document.createElement("div");
      ret.setAttribute("class","mask");
      ret.style.display="none";
      document.getElementsByClassName("modal-backdrop")[0].appendChild(ret);
      return ret
    }
    function createModal() {
      //创建弹窗总的属性
      var ret=document.createElement("div");
      ret.setAttribute("id","chanAva");
      //创建弹窗内容
      //1. 标题div的添加
      var contTitle=document.createElement("div");
      contTitle.setAttribute("class","chanAvaTitle");
      var title=document.createElement("span");
      title.style.fontSize="0.4rem";
      title.innerHTML="更换头像";
      contTitle.appendChild(title)
      ret.appendChild(contTitle)
      //2. 从相册中选择／拍照 按钮的添加
      var cont=document.createElement("ul");
      cont.setAttribute("class","list");
      cont.style.marginTop="3%";
      cont.innerHTML=
        '<li class="chanAvaItem" id="takePhoto">拍照</li>' +
        '<li class="chanAvaItem" id="choPhoto">从相册中选择</li>';
      ret.appendChild(cont)
      document.getElementsByClassName("modal-backdrop")[0].appendChild(ret);
      return ret
    }
    $scope.changeAva=function(){
      var mask;
      var chanAva;
      if(!document.getElementById("chanAva")&&!document.getElementsByClassName("mask")[0]){
        mask=createMask();
        chanAva=createModal();
      }else{
        mask=document.getElementsByClassName("mask")[0];
        chanAva=document.getElementById("chanAva")
      }
      mask.style.display="block";//设置mask的属性
      chanAva.style.display="block";
      //"拍照"按钮点击触发函数
      document.getElementById("takePhoto").onclick=function(){
        console.log("take_photo")
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URI,
          sourceType: Camera.PictureSourceType.CAMERA, //来源：来自相机拍照
          allowEdit: true,
          targetWidth: 100,
          targetHeight: 100,
          mediaType: 0,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true
        };
        // 获取拍照后的相片地址
        $cordovaCamera.getPicture(options).then(
          function(imageURI) {
            alert('拍照图片url:' + imageURI);
            alert(imageURI==""||imageURI==null)
            if(imageURI==""||imageURI==null){
              chanAva.style.display="none";
              mask.style.display="none";//设置mask的属性
              return
            }
            uploadImage(mask,chanAva,imageURI);
          },function(err) {
            alert("拍照图片选取出错！")
            console.log(err)
            chanAva.style.display="none";
            mask.style.display="none";//设置mask的属性
          });
      }
      /*//"选取相册"和"拍照"按钮点击触发函数
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '拍照'
        }, {
          text: '选取相册'
        }],
        titleText: '更换头像',
        cancelText: '取消',
        cancel: function() {
          alert("取消选择")
        },
        buttonClicked: function(index) {
          // 配置相机，设置相片质量，格式，大小，是否默认保存等等
          // 此时默认是打开相机进行拍照
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URI,
            sourceType: Camera.PictureSourceType.CAMERA, //来源：来自相机拍照
            allowEdit: true,
            targetWidth: 100,
            targetHeight: 100,
            mediaType: 0,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
          };
          if (index == 1) {
            options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY; //使用图片库
          }
          // 获取拍照后的相片地址
          $cordovaCamera.getPicture(options).then(
            function(imageURI) {
              alert('拍照图片url:' + imageURI);
              alert(imageURI==""||imageURI==null)
              if(imageURI==""||imageURI==null){
                hideSheet();
                return
              }
              uploadImage(hideSheet,imageURI);
            },function(err) {
              alert("拍照或选取相册出错！")
              console.log(err)
              hideSheet();
            });
          return true;
        }
      });*/

      //"选取相册"按钮点击触发函数
      document.getElementById("choPhoto").onclick=function(){
        console.log("choose_photo")
        //从相册获取图片的配置信息参数
        var imageOptions = {
          maximumImagesCount: 10,
          quality: 100,
          width: 80,
          height: 80
        };
        //获取系统相册
        $cordovaImagePicker.getPictures(imageOptions)
        .then(function (results) {
            alert('选取相册图片url:' + results)
            alert(results==""||results==null)
            if(results==""||results==null){
              chanAva.style.display="none";
              mask.style.display="none";//设置mask的属性
              return
            }
            uploadImage(mask,chanAva,results);
        },function(error) {
            alert("获取系统相册图片信息出错！")
            console.log(error)
            chanAva.style.display="none";
            mask.style.display="none";//设置mask的属性
        });
      }
      //mask点击隐藏自身
      mask.onclick=function(e){
        chanAva.style.display="none";
        mask.style.display="none";//设置mask的属性
        e.stopPropagation();
      }
    }

    //更新头像调用的上传头像到七牛的函数
    function uploadImage(mask,chanAva,results){
      //请求本地获取七牛的签名地址
      ajax.post('signature',
        {
          accessToken:$scope.userInfo.accessToken,
          cloud:'qiniu',
          type:'avatar'
        }).then(function(data){
          alert(data.data.key)
          if(data.success==true){
            var token=data.data.token
            var key=data.data.key
            //表单数据添加与处理
            var body=new FormData();
            body.append('token',token)
            body.append('key',key)
            body.append('file',{
              type:'image/jpeg',
              uri:results,
              name:key
            })
            /*$cordovaFileTransfer.upload(config.qiniu.upload, results, body)
             .then(function(result) {
             alert("头像上传七牛成功！")
             alert(result)
             }, function(err) {
             alert("头像上传七牛失败！")
             }, function (progress) {
             alert("progress.loaded:"+progress.loaded)
             alert("progress.total:"+progress.total)
             var percentComplete = Math.round((progress.loaded / progress.total) * 100);
             alert("进度是："+percentComplete+"%")
             });*/
            /*ajax.post('false',body,config.qiniu.upload).then(function(data){
             data=JSON.parse(data)
             alert(data)
             if(data) {
             if (data.public_id) {
             $scope.userInfo.avatar = avatar(data.public_id);
             alert($scope.userInfo.avatar)
             }
             if (data.key) {
             $scope.userInfo.avatar = avatar(data.key);
             alert($scope.userInfo.avatar)
             }
             alert("头像上传七牛成功！")
             }
             },function(err,status){
             console.log(status)
             console.log(err)
             console.log("头像上传七牛失败！")
             chanAva.style.display="none";
             mask.style.display="none";//设置mask的属性
             })*/
            //上传图片到七牛图床(使用传统的XMLHttpRequest对象方法)
            var xhr=getXHR();//创建XMLHttpRequest对象
            xhr.open("POST",config.qiniu.upload);
            xhr.onload=function(){
              if(xhr.status!=200){
                alert(xhr.status)
                alert(xhr.responseText)
                alert("请求失败！1")
                chanAva.style.display="none";
                mask.style.display="none";//设置mask的属性
                return
              }
              if(!xhr.responseText){
                alert("请求失败！2")
                chanAva.style.display="none";
                mask.style.display="none";//设置mask的属性
                return
              }
              var response;
              try{
                response=JSON.parse(xhr.response)
              }catch(e){
                alert("获取response有错误："+e)
                chanAva.style.display="none";
                mask.style.display="none";//设置mask的属性
              }
              if(response){
                if(response.public_id){
                  $scope.userInfo.avatar=avatar(response.public_id);
                  alert($scope.userInfo.avatar)
                }
                if(response.key){
                  $scope.userInfo.avatar=avatar(response.key);
                  alert($scope.userInfo.avatar)
                }
                //调用接口更新头像到数据库
                ajax.post('my/saveInfo?accessToken='+$scope.userInfo.accessToken,$scope.userInfo).then(function(data){
                  console.log(data)
                  if(data.success==true){
                    alert("头像上传数据库成功！")
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
                    chanAva.style.display="none";
                    mask.style.display="none";//设置mask的属性
                  }else if(data.success==false){
                    console.log(data.msg)
                  }
                },function(status){
                  console.log(status)
                  console.log("更新头像到数据库失败！")
                  chanAva.style.display="none";
                  mask.style.display="none";//设置mask的属性
                })
              }
            }
            //获取上传进度
            if(xhr.upload){
              xhr.upload.onprogress=function(event){
                alert("event.lengthComputable:"+event.lengthComputable)
                if(event.lengthComputable) {
                  alert("event.loaded:"+event.loaded)
                  alert("event.total:"+event.total)
                  var percentComplete = Math.round(event.loaded / event.total*100);
                  alert("进度是："+percentComplete+"%")
                }
              }
            }
            xhr.send(body);
          }else if(data.success==false){
            console.log(data.msg)
          }
        },function(err,status){
          console.log(status)
          console.log(err)
          console.log("获取七牛的签名地址失败！")
          chanAva.style.display="none";
          mask.style.display="none";//设置mask的属性
        })
    }
    //处理头像id的函数
    function avatar(id){
      if(id.indexOf('http:')>-1){
        return id
      }
      if(id.indexOf('data:image')>-1){
        return id
      }
      return 'http://ojr02yxfq.bkt.clouddn.com/'+id
    }
    //保存编辑按钮
    $scope.save=function(){
      if($scope.userInfo.nickname==""){
        $scope.nameAlert = (function() {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '昵称不能为空'
          });
          alertPopup.then(function(res) {
            console.log('需要填写昵称');
          });
        })()
      }else if($scope.userInfo.phone==""){
        $scope.phoneAlert = (function() {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '手机号不能为空'
          });
          alertPopup.then(function(res) {
            console.log('需要填写手机号');
          });
        })()
      }else{
        $scope.showConfirm = (function() {
          var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确定保存吗？',
            cancelText:'取消',
            okText:'确定'
          });
          confirmPopup.then(function(res) {
            if(res) {
              console.log('已点击保存');
              console.log($scope.userInfo)
              //先显示加载指示器
              $ionicLoading.show({ //加载指示器显示
                noBackdrop: true,
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
              });
              //更新后的用户信息保存到数据库中
              ajax.post('my/saveInfo?accessToken='+$scope.userInfo.accessToken,$scope.userInfo).then(function(data){
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
                }else if(data.success==false){
                  console.log(data.msg)
                }
                $ionicLoading.hide()
                $scope.editModal.hide();
              },function(err,status){
                console.log(status)
                console.log(err)
                console.log("更新失败！")
                $ionicLoading.hide()
              })
            } else {
              console.log('未点击保存');
            }
          });
        })()
      }
    }
    /**
     * 编辑资料页面模版结束
     */
    //跳转到消息页面
    $scope.goMsg=function(){
      $state.go('tab.my-msg')
    }
    //跳转到设置页面
    $scope.goSetting=function(){
      $state.go('tab.my-setting')
    }
    //先显示加载指示器，数据获取完再隐藏
    $ionicLoading.show({ //加载指示器显示
      noBackdrop: true,
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    //获取概要信息数据
    ajax.get('my/abstraData?accessToken='+$scope.userInfo.accessToken).then(function(data){
      //data = Mock.mock(data)
      console.log(data)
      if(data.success==true){
        $scope.listenTime=data.data.listenTime;
        $scope.vocab=data.data.vocab;
      }else if(data.success==false){
        console.log(data.msg)
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
    //获取精听记录数据
    ajax.get('my/listenData?accessToken='+$scope.userInfo.accessToken).then(function(data){
      //data = Mock.mock(data)
      console.log(data)
      if(data.success==true){
        $scope.lisTotal=data.total;
        $scope.lisData=data.data;
      }else if(data.success==false){
        console.log(data.msg)
      }
      $ionicLoading.hide()
    },function(err,status){
      console.log(status)
      console.log(err)
      console.log("获取数据失败！")
      $ionicLoading.hide()
    })
  }])
  /*"我的"里面的消息页面控制器
  * */
  .controller('msgCtrl',['$scope',function($scope){
  }])
  /*"我的"里面的设置页面控制器
   */
  .controller('settingCtrl',['$scope',function($scope){
  }])
