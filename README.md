# Ionic1-Learn-Edu-App
用ionic1+Cordova开发的一款学习教育类App
# 项目简介
主要是三个页面：发现、词汇、我的。具体实现的特色功能有：
1. 模仿主流APP的动画效果。
2. 发现页面的下拉刷新模仿主流APP的效果。
3. 发现页面向下滑动获取数据时做的优化。
4. 正在播放页面的播放器功能。
5. 其他ionic的UI组件实现的功能。
# 技术栈
ionic1+Cordova
# 运行打包
1. 把项目clone到本地：git clone https://github.com/GeorgeCodesigner/Ionic1-Learn-Edu-App.git
2. 确保已经安装了nodejs，版本至少6.2.0以上。
3. 打开终端，cd到该项目的根目录下，执行npm install安装依赖包。
4. 依赖包安装好后，运行ionic serve，可以在本地跑起这个项目，并自动打开浏览器进行开发调试。
建议：本地开发调试的话直接运行ionic serve就行。
5. 打包成ios-hybrid-app项目：
ionic platform add ios
ionic build ios
启动xcode模拟器运行该项目(前提：必须是苹果电脑且装了xcode):
ionic emulate ios
6. 打包成android-hybrid-app项目：
   ionic platform add android
   ionic build android
启动Android模拟器运行该项目(前提：最好是安装了Android Studio进行安卓开发，并且配置了SDK和JDK):
ionic emulate android
# 其他注意事项
1. cordova只有在打包ios或者android项目后才能有效使用，如果只是运行ionic serve，将无法使用cordova。
2. js/index.js文件第12行:$state.go("tab.home"); 注释掉，项目启动时将会进入引导页页面，引导页的接口需要启动后台项目和数据库才能使用(后面会说到后台项目的GitHub路径及使用方式)，所以，为了方便起见，使用$state.go("tab.home");直接跳过引导页和登录页，进入首页。
3. js/common/config.js文件，如果没有启动后台项目，使用淘宝RAP假数据接口，注释本地后台项目接口；如果启动后台项目，注释淘宝RAP假数据接口，使用本地后台项目接口。
4. 后台项目GitHub地址：https://github.com/GeorgeCodesigner/Nodejs-Learn-Edu-App-Server


