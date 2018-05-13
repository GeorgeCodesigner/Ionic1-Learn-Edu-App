/**
 * Created by chencz on 2017/2/26.
 */
angular.module('commonDirective', [])
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'AE',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          scope.$watch(attributes.hideTabs, function(value){
            $rootScope.hideTabs = value;
          });
        });
      }
    };
  })
  //播放控件的指令
  .directive('audioPlayer', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl:'templates/audio_player.html',
      controller : function($scope){

      },
      link: function (scope, iElement, iAttrs) {
        var obj={};
        obj.dom = document.getElementsByTagName('audio')[0] //音频播放器dom节点
        obj.pButton = document.getElementById('pButton'); // 音频播放器界面的播放／暂停按钮
        obj.playhead = document.getElementById('playhead');//已进行的进度显示条
        obj.playheadIcon=document.getElementById('playheadIcon');//已进行的进度显示条拉动按钮
        obj.timeline = document.getElementById('timeline');//音频总的进度条（包括未进行和已进行的）
        obj.playedText = document.getElementsByClassName('audio_played')[0];//已播放时长的文本显示
        obj.playLengthText = document.getElementsByClassName('audio_length')[0];//总时长的文本显示
        obj.pauseIcon = document.getElementsByClassName('icon_audio_pause')[0]; //暂停按钮
        obj.playIcon = document.getElementsByClassName('icon_audio_play')[0]; //播放按钮
        obj.replayIcon = document.getElementsByClassName('icon_audio_replay')[0]; //重播按钮
        var musicPlayer=new Player(obj)
        musicPlayer.init();//执行musicPlayer对象初始化方法
        //接收父控制器传来的参数：文本总段数
        scope.$on('totalCount',function(event,data){
          obj.dom.src=data.audioUrl;
          $timeout(function(){
            console.log("obj.dom.duration:"+obj.dom.duration)
            setActiveFont(data.total,obj.dom.duration) //执行设置文本随音频变化的函数
          },1000)
        })
      }
    };
}])
