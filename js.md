### 一些常用js的积累
-  防止被iframe嵌套

  ```
    if(top != self){
        location.href = ”about:blank”;
    }
  ```
  
  -  某年某月的1号为星期几
  
  ```
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    weekday[new Date(2015, 9, 1).getDay()];	//2015年10月1号
  ```
  
  -  js 判断IOS, 安卓

  ```
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    alert('是否是Android：'+isAndroid);
    alert('是否是iOS：'+isiOS);
  ```
  
  -  rem计算适配
  
  ```
    (function(doc, win){
      var docEl = doc.documentElement,
          resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
          recalc = function(){
              var clientWidth = docEl.clientWidth;
              if(!clientWidth) return;
              docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
          };

      if(!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
  ```
  
  -  另外一种rem方案
  ```
    var dpr, rem, scale;
    var docEl = document.documentElement;
    var fontEl = document.createElement('style');
    var metaEl = document.querySelector('meta[name="viewport"]');

    dpr = window.devicePixelRatio || 1;
    rem = docEl.clientWidth * 2 / 10;
    scale = 1 / dpr;


    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);

    // 动态写入样式
    docEl.firstElementChild.appendChild(fontEl);
    fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

    // 给js调用的，某一dpr下rem和px之间的转换函数
    window.rem2px = function(v) {
        v = parseFloat(v);
        return v * rem;
    };
    window.px2rem = function(v) {
        v = parseFloat(v);
        return v / rem;
    };

    window.dpr = dpr;
    window.rem = rem;
  ```
  
  -  获取js所在路径
  
  ```
    function getJsDir (src) {
      var script = null;

      if (src) {
          script = [].filter.call(document.scripts, function (v) {
              return v.src.indexOf(src) !== -1;
          })[0];
      } else {
          script = document.scripts[document.scripts.length - 1];
      }

      return script ? script.src.substr(0, script.src.lastIndexOf('/')) : script;
    }
  ```
  
  -  通过 js 修改微信浏览器的title?
  
  ```
    var $body = $('body');
    document.title = 'title'; // hack在微信等webview中无法修改document.title的情况    
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function(){ 
        setTimeout(function(){ 
            $iframe.off('load').remove() 
        }, 0) 
    }).appendTo($body)
  ```
  
  -  字符串长度截取
  
  ```
    function cutstr(str, len) {
      var temp,
          icount = 0,
          patrn = /[^\x00-\xff]/，
          strre = "";
      for (var i = 0; i < str.length; i++) {
          if (icount < len - 1) {
              temp = str.substr(i, 1);
                  if (patrn.exec(temp) == null) {
                     icount = icount + 1
              } else {
                  icount = icount + 2
              }
              strre += temp
              } else {
              break;
          }
      }
      return strre + "..."
    }
  ```
  
  -  替换全部
  
  ```
    String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2)
    }
  ```
  
  -  清除空格
  
  ```
    String.prototype.trim = function() {
        var reExtraSpace = /^\s*(.*?)\s+$/;
        return this.replace(reExtraSpace, "$1")
    }
  ```
  
  -  设置cookie值
  
  ```
    function setCookie(name, value, Hours) {
        var d = new Date();
        var offset = 8;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = utc + (3600000 * offset);
        var exp = new Date(nd);
        exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=360doc.com;"
    }
  ```
  
  -  获取cookie值
  
  ```
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null
    }
  ```
  
  -   检验URL链接是否有效
  
  ```
    function getUrlState(URL){ 
        var xmlhttp = new ActiveXObject("microsoft.xmlhttp"); 
        xmlhttp.Open("GET",URL, false);  
        try{  
                xmlhttp.Send(); 
        }catch(e){
        }finally{ 
            var result = xmlhttp.responseText; 
            if(result){
                if(xmlhttp.Status==200){ 
                    return(true); 
                 }else{ 
                       return(false); 
                 } 
             }else{ 
                 return(false); 
             } 
        }
    }
  ```
  
  -  获得URL中GET参数值
  
  ```
    // 用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
    function get_get(){ 
        querystr = window.location.href.split("?")
        if(querystr[1]){
            GETs = querystr[1].split("&");
            GET = [];
            for(i=0;i<GETs.length;i++){
                  tmp_arr = GETs.split("=")
                  key=tmp_arr[0]
                  GET[key] = tmp_arr[1]
            }
        }
        return querystr[1];
    }
  ```
  
  -  禁用浏览器前进后退按钮
  
  ```
    window.history.forward(1);
		window.history.forward(-1);
  ```
  
  -  数组去重
  
  ```
    String.prototype.unique=function(){
        var x=this.split(/[\r\n]+/);
        var y='';
        for(var i=0;i<x.length;i++){
            if(!new RegExp("^"+x.replace(/([^\w])/ig,"\\$1")+"$","igm").test(y)){
                y+=x+"\r\n"
            }
        }
        return y
    };
  ```
  
  -  金额大写转换函数
  
  ```
    //格式转换
    function transform(tranvalue) {
        try {
            var i = 1;
            var dw2 = new Array("", "万", "亿"); //大单位
            var dw1 = new Array("拾", "佰", "仟"); //小单位
            var dw = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //整数部分用
            //以下是小写转换成大写显示在合计大写的文本框中     
            //分离整数与小数
            var source = tranvalue.split(".");
            var num = source[0];
            var dig = source[1];
            //转换整数部分
            var k1 = 0; //计小单位
            var k2 = 0; //计大单位
            var sum = 0;
            var str = "";
            var len = source[0].length; //整数的长度
            for (i = 1; i <= len; i++) {
                  var n = source[0].charAt(len - i); //取得某个位数上的数字
                  var bn = 0;
                  if (len - i - 1 >= 0) {
                    bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
                  }
                  sum = sum + Number(n);
                  if (sum != 0) {
                    str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
                    if (n == '0') sum = 0;
                  }
                  if (len - i - 1 >= 0) { //在数字范围内
                    if (k1 != 3) { //加小单位
                          if (bn != 0) {
                            str = dw1[k1].concat(str);
                          }
                          k1++;
                    } else { //不加小单位，加大单位
                          k1 = 0;
                          var temp = str.charAt(0);
                          if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
                          str = str.substr(1, str.length - 1);
                          str = dw2[k2].concat(str);
                          sum = 0;
                    }
                  }
                  if (k1 == 3){ //小单位到千则大单位进一
                    k2++;
                  }
            }
            //转换小数部分
            var strdig = "";
            if (dig != "") {
                  var n = dig.charAt(0);
                  if (n != 0) {
                    strdig += dw[Number(n)] + "角"; //加数字
                  }
                  var n = dig.charAt(1);
                  if (n != 0) {
                    strdig += dw[Number(n)] + "分"; //加数字
                  }
            }
            str += "元" + strdig;
        } catch(e) {
            return "0元";
        }
        return str;
    }
  ```
  
  -  字符串反序输出
  
  ```
    function IsReverse(text){
        return text.split('').reverse().join('');
    }
  ```
  
  - 设置cookie
  ```
  function setCookie(cname,cvalue,exdays){
       var d = new Date();
       d.setTime(d.getTime()+(exdays*24*60*60*1000));
       var expires = "expires="+d.toGMTString();
       document.cookie = cname + "=" + cvalue + "; " + expires;
  }
  ```
  
 - 获取cookie
  ```
  function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
```

- 检测cookie函数
<p>
如果设置了 cookie，将显示一个问候信息。
如果没有设置 cookie，将会显示一个弹窗用于询问访问者的名字，并调用 setCookie 函数将访问者的名字存储 365 天：</p>
```
function checkCookie(){
  var user=getCookie("username");
  if (user!="")
  {
    alert("Welcome again " + user);
  }
  else 
  {
    user = prompt("Please enter your name:","");
    if (user!="" && user!=null)
    {
      setCookie("username",user,365);
    }
  }
}
```
  
