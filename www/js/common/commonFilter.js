/**
 * Created by chencz on 2017/3/26.
 */
angular.module('commonFilter', [])
  .filter('changeTime', function($sce){
    return function(input) {
      if(input>=3600){
        return parseInt(input/3600)+'h'
      }else if(input>=60&&input<3600){
        return parseInt(input/60)+'min'
      }else{
        return parseInt(input)+'sec'
      }
    }
  })
  .filter('changeDur', function($sce){
    return function(input) {
      var hStr, minStr, secStr, h, min, sec;
      if(input>=3600){
        h=parseInt(input/3600);
        min=parseInt((input-h*3600)/60);
        sec=parseInt((input-h*3600-min*60)/60);
        hStr=h>=10?h:"0"+h;
        minStr=min>=10?min:"0"+min;
        secStr=sec>=10?sec:"0"+sec;
        return hStr+":"+minStr+":"+secStr
      }else if(input>=60&&input<3600){
        min=parseInt(input/60);
        sec=parseInt((input-min*60)/60);
        minStr=min>=10?min:"0"+min;
        secStr=sec>=10?sec:"0"+sec;
        return "00:"+minStr+":"+secStr
      }else{
        secStr=input>=10?input:"0"+input;
        return "00:00:"+secStr
      }
    }
  })

