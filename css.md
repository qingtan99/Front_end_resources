### 一些常用的css积累
-  文字换行

```
  /*强制不换行*/
  white-space:nowrap;
  /*自动换行*/
  word-wrap: break-word;
  word-break: normal;
  /*强制英文单词断行*/
  word-break:break-all;
```

-  两端对齐

```
  text-align:justify;text-justify:inter-ideogra
```

-  去掉Webkit(chrome)浏览器中input(文本框)或textarea的黄色焦点框

```
  input,button,select,textarea{ outline:none;}
  textarea{ resize:none;}
```

-  [去掉chrome记住密码后自动填充表单的黄色背景](http://www.tuicool.com/articles/EZ777n)

-  鼠标不允许点击
```
  cursor:not-allowed;
```

-  mac font: osx平台字体优化

```
  font-family:"Hiragino Sans GB","Hiragino Sans GB W3",'微软雅黑';
```

-  文字过多后显示省略号

```
  .ellipsis,.ell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
```

-  投影

```
  .b{box-shadow:inset 1px -1px 0 #f1f1f1;text-shadow:1px 1px 0px #630;}
  filter:progid:DXImageTransform.Microsoft.gradient(enabled='true',startColorstr='#99000000',endColorstr='#99000000');background:rgba(0,0,0,.6);
  background:rgba(0,0,0,0.5);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#50000000',endColorstr='#50000000')\9;
```

-  search占位

```
  ::-webkit-input-placeholder {}
  ::-moz-input-placeholder {}
  input:focus::-webkit-input-placeholder { color: transparent; }
  -webkit-appearance:none;  google边框去除
  input[type="search"]{-webkit-appearance:textfield;} // 去除chrome默认样式
  http://i.wanz.im/2011/02/04/remove_border_from_input_type_search/
  http://blog.csdn.net/do_it__/article/details/6789699
  line-height: normal; /* for non-ie */
  line-height: 22px\9; /* for ie */
```

-  [input:focus时input不随软键盘升起而抬高的情况](http://www.cnblogs.com/hongru/archive/2013/02/06/2902938.html)

-  取消chrome form表单的聚焦边框

```
  input,button,select,textarea{outline:none}
  textarea{resize:none}
```

-  取消a链接的黄色边框

```
  a{-webkit-tap-highlight-color:rgba(0,0,0,0);}
```

-  取消input,button焦点或点击时蓝色边框

```
  input{outline:none;}
```
-  取消chrome 搜索x提示

```
  input[type=search]::-webkit-search-decoration,
  input[type=search]::-webkit-search-cancel-button,
  input[type=search]::-webkit-search-results-button,
  input[type=search]::-webkit-search-results-decoration {
      display: none;
  }
```

-  chrome取消默认黄色背景

```
  input:-webkit-autofill {-webkit-box-shadow: 0 0 0px 1000px white inset;}
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  autocomplete="off"
```

-  手机版本网页a标记虚线框问题

```
  a:focus {outline:none;-moz-outline:none;}
```

-  placeholder占位符颜色自定义

```
  input:-moz-placeholder {color: #369;}
  ::-webkit-input-placeholder {color:#369;}
```

-  IOS 禁用高亮

```
  -webkit-tap-highlight-color:rgba(255,0,0,0.5);-webkit-tap-highlight-color:transparent; /* For some Androids */
```

-  IOS iframe 滚动 [滚动回弹特效](http://www.cnblogs.com/flash3d/archive/2013/09/28/3343877.html)

```
  -webkit-overflow-scrolling:touch;overflow-y:scroll;
```

-  禁止选中文本

```
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
```

-  HTML5手机浏览直接给一个号码打电话，发短信

```
  <a href="tel:15222222222">移动WEB页面JS一键拨打号码咨询功能</a>
  <a href="sms:15222222222">移动WEB页面JS一键发送短信咨询功能</a>
  <!--移动web页面自动探测电话号码-->
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="x-rim-auto-match" content="none">
```

-  CSS判断横屏竖屏

```
  @media screen and (orientation: portrait) {
    /*竖屏 css*/
  } 
  @media screen and (orientation: landscape) {
    /*横屏 css*/
  }
```

```
  //判断手机横竖屏状态：
  window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
          if (window.orientation === 180 || window.orientation === 0) { 
              alert('竖屏状态！');
          } 
          if (window.orientation === 90 || window.orientation === -90 ){ 
              alert('横屏状态！');
          }  
      }, false); 
  //移动端的浏览器一般都支持window.orientation这个参数，通过这个参数可以判断出手机是处在横屏还是竖屏状态。
```

-  rem 适配

  - [rem自适应方案](https://github.com/imweb/mobile/issues/3)
  - [html5移动端页面分辨率设置及相应字体大小设置的靠谱使用方式](http://www.cnblogs.com/willian/p/3573353.html)
  - [移动端高清、多屏适配方案](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)
  - [通过rem布局+media-query:aspect-ratio实现移动端全机型适配覆盖](http://xiaoyuze88.github.io/blog/2015/05/12/%E9%80%9A%E8%BF%87rem%E5%B8%83%E5%B1%80+media-query%E7%9A%84aspect-ratio%E5%AE%9E%E7%8E%B0%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%A8%E6%9C%BA%E5%9E%8B%E9%80%82%E9%85%8D%E8%A6%86%E7%9B%96/)
  - [web app变革之rem](http://isux.tencent.com/web-app-rem.html)
  - [手机淘宝的flexible设计与实现](http://www.html-js.com/article/2402)
  - [移动端自适应方案](https://github.com/amfe/lib-flexible)
  - [【原创】移动端高清、多屏适配方案](http://www.html-js.com/article/3041)
  - [6个html5页面适配iphone6的技巧](http://qietuwang.baijia.baidu.com/article/73861)
  - [关于移动端 rem 布局的一些总结](http://segmentfault.com/a/1190000003690140)
  - [从网易与淘宝的font-size思考前端设计稿与工作流](http://www.cnblogs.com/lyzg/p/4877277.html)
  - [移动端自适应方案](http://f2e.souche.com/blog/yi-dong-duan-zi-gua-ying-fang-an/)
  - [MobileWeb 适配总结](http://www.w3ctech.com/topic/979)
  - [移动端web app自适应布局探索与总结](http://www.html-js.com/article/JavaScript-learning-notes%203234)
  
- css相关总结网址

  - [css常用效果总结](http://www.haorooms.com/post/css_common)
  - [css的不常用效果总结](http://www.haorooms.com/post/css_notuse_common)
  - [css开发技巧](http://www.haorooms.com/post/css_skill)
  - [重温css的选择器](http://www.haorooms.com/post/css_selectelement)
  - [css的变量和继承](http://www.haorooms.com/post/css_inherit_bl)
  - [css3的混合模式](http://www.haorooms.com/post/css3_mixblendmode)
  - [css中伪元素before或after中content的特殊用法attr](http://www.haorooms.com/post/content_attr)


















