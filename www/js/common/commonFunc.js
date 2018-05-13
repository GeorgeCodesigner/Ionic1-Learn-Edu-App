/**
 * Created by chencz on 2017/2/21.
 */
//探测窗口宽高并获取宽高值
var fontSize; //存放html的font-size
var winSizeGet={
  getWinWidth:function(){
    if(window.innerWidth){
      return winWidth=window.innerWidth;
    }else if(document.body && document.body.clientWidth){
      return winWidth=document.body.clientWidth;
    }else if(document.documentElement && document.documentElement.clientWidth){
      return winWidth=document.documentElement.clientWidth;
    }
  },
  getWinHeight:function(){
    if(window.innerHeight){
      return winHeight=window.innerHeight;
    }else if(document.body && document.body.clientHeight){
      return winHeight=document.body.clientHeight;
    }else if(document.documentElement && document.documentElement.clientHeight){
      return winHeight=document.documentElement.clientHeight;
    }
  }
}
//计算不同设备的fontSize值并插入DOM调用的方法
var fontSizeSet={
  setFontSize:function(){
    var fontE1=document.createElement("style");
    var winWidth=winSizeGet.getWinWidth();
    fontSize=winWidth/750*100;
    fontE1.innerHTML="html{font-size:"+fontSize+"px!important;}";
    document.documentElement.firstElementChild.appendChild(fontE1);
  }
}
//兼容所有浏览器的XMLHttpRequest对象
function getXHR(){
  var xmlhttp;
  if(window.XMLHttpRequest){ //code for all new browsers
    return xmlhttp=new XMLHttpRequest();
  }else if(window.ActiveXObject){ //code for IE5 and IE6
    return xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
}
//触摸效果的设置
var touchEffect={
  wave:function(dom) {
    var waveDom = angular.element(dom)
    dom.onclick=function(){
      waveDom.addClass("waveShow")
      setTimeout(function () {
        waveDom.removeClass("waveShow")
      }, 500)
    }
  }
}
//通用函数：给数组添加一个一个的键值对
var dictionary=(function(){
  var array=[];
  return {
    create : function(){
      return array
    },
    put : function(key,value){
      array[key] = value;
    },
    get : function(key){
      return array[key];
    }
  }
})()
//登录页面光标聚焦触发函数
function focusInput(id) {
  document.getElementById(id).style.borderColor="red"
}
//登录页面光标失焦触发函数
function blurInput(id){
  document.getElementById(id).style.borderColor="#cccccc"
}
/**
 * 手机号及验证码校验
 */
//手机号为空的校验函数
var pNull=function(phoneNo){
  if(phoneNo==""){
    document.getElementById("errMsg").style.visibility="visible"
    document.getElementById("errMsg").innerHTML="手机号不能为空"
    setTimeout(function(){
      document.getElementById("errMsg").style.visibility="hidden"
    },2000)
    return false
  }else{
    return "nextSuccessor" //进入下一个节点
  }
}
//手机号不正确的校验函数
var pIncor=function(phoneNo){
  var mobilepat=/^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/g;
  if(mobilepat.test(phoneNo)==false){
    document.getElementById("errMsg").style.visibility="visible"
    document.getElementById("errMsg").innerHTML="请输入正确的手机号"
    setTimeout(function(){
      document.getElementById("errMsg").style.visibility="hidden"
    },2000)
    return false
  }else{
    console.log("手机号没问题")
  }
}
//验证码为空的校验函数
var cNull=function(code,correctCode){
  if(code==""){
    document.getElementById("errMsg").style.visibility="visible"
    document.getElementById("errMsg").innerHTML="验证码不能为空"
    setTimeout(function(){
      document.getElementById("errMsg").style.visibility="hidden"
    },2000)
    return false
  }else{
    return "nextSuccessor" //进入下一个节点
  }
}
//验证码为空的校验函数
var cIncor=function(code,correctCode){
  if(code!=correctCode){
    document.getElementById("errMsg").style.visibility="visible"
    document.getElementById("errMsg").innerHTML="验证码不正确"
    setTimeout(function(){
      document.getElementById("errMsg").style.visibility="hidden"
    },2000)
    return false
  }else{
    console.log("验证码没问题")
  }
}
//职责链往下走的函数
Function.prototype.after=function(fn){
  var self=this;
  return function(){
    var ret=self.apply(this,arguments)
    if(ret=="nextSuccessor"){
      return fn.apply(this,arguments)
    }
    return ret
  }
}
/**
 * 单例模式通用方法
 */
//getSingle函数
var getSingle=function(fn){
  var ret;
  return function(){
    return ret||(ret=fn.apply(this,arguments))
  }
}
//管理幕布mask单例的函数：
var mask=function(){
  var ret=document.createElement("div");
  ret.setAttribute("class","mask");
  ret.style.display="none";
  document.body.appendChild(ret);
  return ret
}
/**
 * 管理分享弹窗shareModal单例的函数
 */
var shareModal=function(){
  //创建弹窗总的属性
  var ret=document.createElement("div");
  ret.setAttribute("id","share");
  //创建弹窗内容
  //1. 标题div的添加
  var contTitle=document.createElement("div");
  contTitle.setAttribute("class","row shareTitle");
  var title=document.createElement("span");
  title.style.fontSize="0.4rem";
  title.innerHTML="分享到";
  contTitle.appendChild(title)
  ret.appendChild(contTitle)
  //2. 分享按钮的添加
  var contShare=document.createElement("div");
  contShare.setAttribute("class","row shareButRow");
  contShare.style.marginTop="2%";
  //添加社交类型分享按钮
  startShare(0,contShare,'social',[
    {shareImgUrl:"img/1.png",
     shareName:"听友圈",
     imgHref:"https://www.baidu.com"
    },
    {shareImgUrl:"img/1.png",
      shareName:"朋友圈",
      imgHref:"https://www.baidu.com"
    },
    {shareImgUrl:"img/1.png",
      shareName:"QQ空间",
      imgHref:"https://www.baidu.com"
    },
    {shareImgUrl:"img/1.png",
      shareName:"新浪微博",
      imgHref:"https://www.baidu.com"
    }
  ])
  ret.appendChild(contShare)
  document.body.appendChild(ret);
  return ret
}
/**享元模式创建分享按钮开始
 * 他们的内部状态是shareType(分享按钮的类型),外部状态是shareImgUrl、shareName、imgHref
 */
//明确shareType是内部状态
var share=function(shareType){
  this.shareType=shareType;
}
//工厂函数进行对象实例化(创建shareType对象)
var shareFactory=(function(){
  var shareObj={}
  return{
    create:function(shareType){
      if(shareObj[shareType]){
        return shareObj[shareType]
      }
      return shareObj[shareType]=new share(shareType) //一种shareType的对象只创建一个
    }
  }
})()
//管理器:向UploadFactory提交添加shareBut对象的请求
var shareManager=(function(){
  var shareDatabases={};
  return {
    add:function(id,domInsert,shareType,shareImgUrl,shareName,imgHref){
      var flyWeightObj=shareFactory.create(shareType);
      var dom=document.createElement("a");
      dom.setAttribute("class","shareBut")
      dom.innerHTML =
        '<img style="width:80%" src="'+shareImgUrl+'" >' +
        '<div style="color: #000000;">'+shareName+'</div>';
      dom.href=imgHref;
      domInsert.appendChild(dom);
      shareDatabases[id]={
        shareImgUrl:shareImgUrl,
        shareName:shareName,
        imgHref:imgHref,
        dom:dom
      }
      console.log(shareDatabases)
      console.log(flyWeightObj)
      return flyWeightObj
    }
  }
})()
//触发添加shareBut动作startShare函数
var startShare=function(id,domInsert,shareType,files){
  for(var i= 0,file;file=files[i++];){
    var shareObj=shareManager.add(++id,domInsert,shareType,file.shareImgUrl,file.shareName,file.imgHref);
  }
}
/**享元模式创建分享按钮结束
 *
 */

/**播放控件创建类,定义音乐播放器类Player
 * 1.传入参数obj以下的键对应的意思：
 * dom：音频播放器的dom节点
 * wrapper:音频播放器界面包裹的节点
 * pButton:音频播放器界面的播放／暂停按钮
 * playhead:已进行的进度显示条
 * playheadIcon:已进行的进度显示条拉动按钮
 * timeline:音频总的进度条（包括未进行和已进行的）
 * playedText:已播放时长的文本显示
 * playLengthText:总时长的文本显示
 * pauseIcon:暂停按钮
 * playIcon:播放按钮
 * replayIcon:重播按钮
 */
var Player=function(obj){
  this.dom=obj.dom
  this.pButton=obj.pButton
  this.playhead=obj.playhead
  this.playheadIcon=obj.playheadIcon
  this.timeline=obj.timeline
  this.playedText=obj.playedText
  this.playLengthText=obj.playLengthText
  this.pauseIcon=obj.pauseIcon
  this.playIcon=obj.playIcon
  this.replayIcon=obj.replayIcon
  this.onplayhead = false;//标记playhead是否处于被滑动的状态
  this.total=null;
  //音频进度的宽度：如果playhead初始值=0，timelineWidth=timeline的宽度；
  //如果playhead初始值不等于0，timelineWidth就不等于timeline的宽度
  this.timelineWidth=this.timeline.offsetWidth - this.playhead.offsetWidth;
}
//Player初始化方法
Player.prototype.init=function(){
  console.log('player init');
  var that=this
  //监听当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时，会发生 canplaythrough 事件;只要音频在播放就会触发该事件
  if(window.addEventListener) { //支持addEventListener的浏览器
    this.dom.addEventListener("canplaythrough", function () {
      that.playedText.textContent = timeFormat(Math.floor(that.dom.currentTime));//初始化已播放时长的文本显示
      that.playLengthText.textContent = timeFormat(Math.floor(that.dom.duration));//初始化总时长的文本显示
    }, false);
  }else if(window.attachEvent){ //支持attachEvent的浏览器(IE8(含)以上，不考虑IE6/7)
    this.dom.attachEvent("oncanplaythrough", function () {
      that.playedText.textContent = timeFormat(Math.floor(that.dom.currentTime));//初始化已播放时长的文本显示
      that.playLengthText.textContent = timeFormat(Math.floor(that.dom.duration));//初始化总时长的文本显示
    });
  }
  //监听点击播放／暂停按钮触发的事件
  this.pButton.onclick=function(){
    that.play()
  }
  //监听音频播放时间更新所触发的事件
  if(window.addEventListener){
    this.dom.addEventListener("timeupdate", function(){
      that.timeUpdate()
    }, false);
  }else if(window.attachEvent){
    this.dom.attachEvent("ontimeupdate", function(){
      that.timeUpdate()
    });
  }
  //监听音频播放结束所触发的事件
  if(window.addEventListener){
    this.dom.addEventListener("ended", function () {
      that.end()
    }, false);
  }else if(window.attachEvent){
    this.dom.attachEvent("onended", function () {
      that.end()
    });
  }
  //监听音频总的进度条timeline点击时音频进度变化触发的事件
  this.timeline.onclick=function(event){
    moveplayhead(event,that.playhead,that.playheadIcon,that.timeline,that.timelineWidth)
    that.dom.currentTime = that.dom.duration * clickPercent(event,that.timeline,that.timelineWidth);
    that.playedText.textContent = timeFormat(Math.floor(that.dom.currentTime));
    if(window.addEventListener){
      that.dom.addEventListener("timeupdate", function(){
        that.timeUpdate()
      }, false);
    }else if(window.attachEvent){
      that.dom.attachEvent("ontimeupdate", function(){
        that.timeUpdate()
      });
    }
    c=parseInt(that.dom.currentTime)
  }
  //监听已进行的进度显示条playhead滑动（分为touchstart,touchmove,touchend）时音频进度变化触发的事件
  if(window.addEventListener){
    this.timeline.addEventListener('touchstart', function(){
      console.log("触摸开始")
      that.onplayhead = true;
      if(window.addEventListener){
        that.timeline.addEventListener('touchmove', function(event) {
          console.log("触摸滑动中")
          movetimeline(event, that.playhead, that.playheadIcon,that.timeline, that.timelineWidth)
        }, true);
      }else if(window.attachEvent){
        that.timeline.attachEvent('ontouchmove', function(event) {
          console.log("触摸滑动中")
          movetimeline(event, that.playhead, that.playheadIcon,that.timeline, that.timelineWidth)
        });
      }
    }, false);
  }else if(window.attachEvent){
    this.timeline.attachEvent('ontouchstart', function(){
      console.log("触摸开始")
      that.onplayhead = true;
      if(window.addEventListener){
        that.timeline.addEventListener('touchmove', function(event) {
          console.log("触摸滑动中")
          movetimeline(event, that.playhead, that.playheadIcon,that.timeline, that.timelineWidth)
        }, true);
      }else if(window.attachEvent){
        that.timeline.attachEvent('ontouchmove', function(event) {
          console.log("触摸滑动中")
          movetimeline(event, that.playhead, that.playheadIcon,that.timeline, that.timelineWidth)
        });
      }
    });
  }
  //触摸结束触发的事件
  if(window.addEventListener){
    this.timeline.addEventListener('touchend', function(event){
      console.log("触摸结束")
      if (that.onplayhead === true) {
        movetimelineEnd(event,that.playhead, that.playheadIcon,that.timeline, that.timelineWidth);
        that.dom.currentTime = that.dom.duration * touchPercent(event,that.timeline,that.timelineWidth);
        that.playedText.textContent = timeFormat(Math.floor(that.dom.currentTime));
        if(window.addEventListener){
          that.dom.addEventListener("timeupdate", function(){
            that.timeUpdate()
          }, false);
        }else if(window.attachEvent){
          that.dom.attachEvent("ontimeupdate", function(){
            that.timeUpdate()
          });
        }
        c=parseInt(that.dom.currentTime)
      }
      that.onplayhead = false;
    }, false);
  }else if(window.attachEvent){
    this.timeline.attachEvent('ontouchend', function(event){
      console.log("触摸结束")
      if (that.onplayhead === true) {
        movetimelineEnd(event,that.playhead, that.playheadIcon,that.timeline, that.timelineWidth);
        that.dom.currentTime = that.dom.duration * touchPercent(event,that.timeline,that.timelineWidth);
        that.playedText.textContent = timeFormat(Math.floor(that.dom.currentTime));
        if(window.addEventListener){
          that.dom.addEventListener("timeupdate", function(){
            that.timeUpdate()
          }, false);
        }else if(window.attachEvent){
          that.dom.attachEvent("ontimeupdate", function(){
            that.timeUpdate()
          });
        }
        c=parseInt(that.dom.currentTime)
      }
      that.onplayhead = false;
    });
  }
}
/**
 * 设置音频播放时的文本状态变化
 */
var totalCnt; //存放文本总段数的值
var durTime; //存放音频总长度的值
var c=0; //计数，每一秒加一
var active=0; //gap的倍数就加一
var gap; //音频总长度与文本段数相除的结果
var t //timeCount函数回调的方法
var distance=[];//文本随着播放进行上下移动的距离存放的数组
var marBotHei=0; //存放文本之间的margin-bottom值
//指令link属性调用的方法
function setActiveFont(total,duration){
  //console.log("total:"+total)
  totalCnt=total
  durTime=duration
  gap=Math.ceil(durTime/totalCnt)
  marBotHei=parseInt($("#item0").css("margin-bottom"));
  for(var i=0;i<totalCnt;i++){ //获得distance数组每次移动的值
    if(i==0){
      distance[0]=$("#item0").offset().top
    }else {
      var j=i-1
      distance[i]=distance[j]+$("#item"+j).height()
      distance[i]+=marBotHei
    }
  }
  console.log("durTime:"+durTime)
  console.log("gap:"+gap)
  t=setInterval(timeCount, 1000);
}
//计时函数
function timeCount(){
  //console.log(c)
  if(c!=Math.ceil(durTime)){
    if(c==0){ //第一次进入时候的情况
      active=parseInt(c/gap)
      setFontState(active,totalCnt,distance[0])
    }else if((active!=parseInt(c/gap))){ //间隔gap跳动或者点击进度条或者滑动进度条跳转触发情况
      active=parseInt(c/gap)
      if(active!=0){
        setFontState(active,totalCnt,distance[active])
      }else{
        setFontState(active,totalCnt,distance[0])
      }
    }else{ //active与parseInt(c/gap)一样的情况
      active=parseInt(c/gap)
      setFontState(active,totalCnt,distance[active])
    }
    //console.log("active:"+active)
    //console.log("c/gap:"+parseInt(c/gap))
  }else{
    active=-1;
    c=0;
    setFontState(active,totalCnt,-1);
    clearInterval(t);
  }
  c++;
}
//设置文本颜色及状态
function setFontState(count,total,distance){
  var move;
  if(active!=-1){
    //设置字体颜色
    for(var i=0;i<total;i++){
      $("#item"+i).removeClass("activeFont")
    }
    $("#item"+count).addClass("activeFont")
    //设置移动距离
    move=0-(distance-fontSize*3)
    //console.log(distance)
    //console.log(move)
    document.getElementById("audioText").childNodes[0].style.transform="translate3d(0px, "+move+"px, 0px) scale(1)";
    console.log(document.getElementById("audioText").childNodes[0].style.transform);
  }else{
    //设置字体活动状态清空，回到初始状态
    for(var i=0;i<total;i++){
      $("#item"+i).removeClass("activeFont")
    }
    document.getElementById("audioText").childNodes[0].style.transform="translate3d(0px, 0px, 0px) scale(1)";
    //console.log(document.getElementById("audioText").childNodes[0].style.transform);
  }
}
/**
 * 音频播放／暂停按钮点击触发的事件
 */
Player.prototype.play=function(){
  var that=this
  if (this.dom.paused) { // start audio
    this.dom.play();
    this.replayIcon.style.display = "none";
    this.pauseIcon.style.display = "inline-block";
    this.playIcon.style.display = "none";
    t= setInterval(timeCount, 1000);
  } else if(this.dom.ended){ // audio ended
    this.dom.currentTime=0
    this.dom.play();
    this.replayIcon.style.display = "none";
    this.pauseIcon.style.display = "none";
    this.playIcon.style.display = "inline-block";
    t= setInterval(timeCount, 1000);
  } else { // pause audio
    this.dom.pause();
    this.pauseIcon.style.display = "none";
    this.playIcon.style.display = "inline-block";
    this.replayIcon.style.display = "none";
    clearInterval(t);
  }
}
//音频播放时间更新所触发的事件
Player.prototype.timeUpdate=function(){
  var currentTime=this.dom.currentTime
  var duration=this.dom.duration
  var playPercent = this.timelineWidth * (currentTime / duration);
  this.playhead.style.width = playPercent + "px";
  this.playheadIcon.style.marginLeft = playPercent + "px";
  this.playedText.textContent = timeFormat(Math.floor(currentTime));
  if (currentTime == duration) { //音频播放结束
    this.pauseIcon.style.display = "none";
    this.playIcon.style.display = "none";
    this.replayIcon.style.display = "inline-block";
  }
}
//音频播放结束所触发的事件
Player.prototype.end=function(){
  var currentTime = this.dom.duration
  var duration = this.dom.duration
  var playPercent = this.timelineWidth
  this.playhead.style.width = playPercent + "px";
  this.playheadIcon.style.marginLeft = playPercent + "px";
  this.playedText.textContent = timeFormat(Math.floor(currentTime));
  this.pauseIcon.style.display = "none";
  this.playIcon.style.display = "none";
  this.replayIcon.style.display = "inline-block";
}
/**时长的文本显示格式调用的函数
 */
function timeFormat(duration) {
  var durdate = new Date(parseInt(duration) * 1000);
  var durminite = durdate.getMinutes()>=10?durdate.getMinutes():"0"+durdate.getMinutes();
  var dursecond = durdate.getSeconds()>=10?durdate.getSeconds():"0"+durdate.getSeconds();
  return durminite + ":" + dursecond;
}
/**已进行的进度显示条移动变化时所调用的函数
 * 1.传入参数：
 * e:event事件
 * playhead:已进行的进度显示条
 * timeline:音频总的进度条
 * timelineWidth:音频进度的宽度
 */
function moveplayhead(e,playhead,playheadIcon,timeline,timelineWidth) {
  //pageX表示鼠标点击位置相对于页面最左侧的x轴的坐标点，offsetLeft是timeline相对于页面最左侧的距离
  var newProcess = e.pageX - timeline.offsetLeft;
  if (newProcess >= 0 && newProcess <= timelineWidth) {
    playhead.style.width = newProcess + "px";
    playheadIcon.style.marginLeft = newProcess + "px";
  }
  if (newProcess < 0) {
    playhead.style.width = "0px";
    playheadIcon.style.marginLeft = "0px";
  }
  if (newProcess > timelineWidth) {
    playhead.style.width = timelineWidth + "px";
    playheadIcon.style.marginLeft = timelineWidth + "px";
  }
}
/**手指滑动总进度显示条滑动过程中所调用的函数
 * 1.传入参数：
 * e:event事件
 * playhead:已进行的进度显示条
 * timeline:音频总的进度条
 * timelineWidth:音频进度的宽度
 */
function movetimeline(e,playhead,playheadIcon,timeline,timelineWidth) {
  //e.touches[0].clientX表示touchstart和touchmove事件滑动时相对于页面最左侧的x轴的坐标点，offsetLeft是timeline相对于页面最左侧的距离
  var newProcess = e.touches[0].clientX - timeline.offsetLeft;
  if (newProcess >= 0 && newProcess <= timelineWidth) {
    playhead.style.width = newProcess + "px";
    playheadIcon.style.marginLeft = newProcess + "px";
  }
  if (newProcess < 0) {
    playhead.style.width = "0px";
    playheadIcon.style.marginLeft = "0px";
  }
  if (newProcess > timelineWidth) {
    playhead.style.width = timelineWidth + "px";
    playheadIcon.style.marginLeft = timelineWidth + "px";
  }
}
/**手指滑动总进度显示条滑动结束时所调用的函数
 * 1.传入参数：
 * e:event事件
 * playhead:已进行的进度显示条
 * timeline:音频总的进度条
 * timelineWidth:音频进度的宽度
 */
function movetimelineEnd(e,playhead,playheadIcon,timeline,timelineWidth) {
  //e.changedTouches[0].clientX表示touchend事件滑动结束时相对于页面最左侧的x轴的坐标点，offsetLeft是timeline相对于页面最左侧的距离
  var newProcess = e.changedTouches[0].clientX - timeline.offsetLeft;
  if (newProcess >= 0 && newProcess <= timelineWidth) {
    playhead.style.width = newProcess + "px";
    playheadIcon.style.marginLeft = newProcess + "px";
  }
  if (newProcess < 0) {
    playhead.style.width = "0px";
    playheadIcon.style.marginLeft = "0px";
  }
  if (newProcess > timelineWidth) {
    playhead.style.width = timelineWidth + "px";
    playheadIcon.style.marginLeft = timelineWidth+"px";
  }
}
/**音频总的进度条点击所在的位置占总进度的百分比
 * 1.传入参数：
 * e:event事件
 * timeline:音频总的进度条
 * timelineWidth:音频进度的宽度
 */
function clickPercent(e,timeline,timelineWidth) {
  return (e.pageX - timeline.offsetLeft) / timelineWidth;
}
/**音频总的进度条滑动最终位置占总进度的百分比
 * 1.传入参数：
 * e:event事件
 * timeline:音频总的进度条
 * timelineWidth:音频进度的宽度
 */
function touchPercent(e,timeline,timelineWidth) {
  return (e.changedTouches[0].clientX - timeline.offsetLeft) / timelineWidth;
}



