/**
 *
 * 本弹幕为播放器外生成，所以全屏无法显示的⊙▽⊙，还不会视频里嵌入呀╮(￣▽￣)╭
 * 调用方法，举个栗子：
	var barrage = new barrageCreate($('#id_video_container')); //实例化 
	barrage.start(); //开启
	barrage.push([0,'内容']); //注入内容,前数为身份标识
 * 后为用户输入内容
 *
 *
 */

(function(win){
	
	win.barrageCreate = function(container){
		var container = container; //容器
		var cw = 0,//容器宽
			ch = 0,//容器高
			num = 0,//弹幕序列号
			lmax = 0,//最多显示的弹幕行数
			ln = 0,//可显示的弹幕行数
			min = 0,//最短行
			sw = 1,//弹幕开关，1开0关
			lw = [],//多条飞行弹幕宽度
			font = 20,//字体大小
			lh = parseInt(1.3*font),//每行弹幕高度
			lh_m = lh,//中间滚动弹幕
			lsav = 0;//记录之前用的行数
			state_m = [],//中间滚动弹幕状态
			speed = 15000,//弹幕滚屏默认时间
			wtime = 5000,//弹幕间隔请求时间
			mx = 20,//一次最多进入弹幕条数
			queue = [],//弹幕容器
			queue_mid = [];//悬挂弹幕容器

		// 清空所有弹幕
		this.clearAll = function(){
			queue = [];
			//所有行宽度等于0
			$('.flying').remove();
		}

		//弹幕开关
		this.switchOn = function(){
			sw = 1;
		}
		this.switchOff = function(){
			sw = 0;
		}

		// 抛入数据
		this.pushData = function(data){
			queue.push(data);
		}

		//修改字体
		this.setFont = function(){
			font = t;
		}

		//修改间隔时间
		this.setWtime = function(t){
			wtime = t;
		}

		//修改间隔时间
		this.setSpeed = function(s){
			speed = s;
		}

		// 获取当前容器宽高
		var getCurrentwidth = function() {
			cw = container.width();
			ch = container.height();
			speed = 15*cw; //弹幕滚动速度修正
			font = parseInt((cw - 1000)/100) + 20;
			lh = parseInt(1.3*font);
		}

		// 弹幕显示的总行数计算
		var linezRepair = function(lz) {
			ln = parseInt(1.3*font);
			var linenum = ch/lh;
			lmax = parseInt(linenum) - 1;
			var lhaf = parseInt(linenum/2);
			var lthr = parseInt(linenum/3);
			if(lz > lhaf) {
				ln = lmax;
			}else if (lz > lthr){
				ln = lhaf;
			}else{
				ln = lthr;
			}
			if(lsav != ln){
				lwReset();
				lsav = ln;
			}
		}

		//每行重新计算
		var lwReset = function(){
			lmax = parseInt(ch/lh) - 1;
			for(var i = 0; i<lmax; i++){
				lw[i] = Math.random();
			}
		}

		//飞行弹幕生成
		var barrageEmbed = function() {
			if(sw == 0){
				queue = [];
				lw = [];
				return;
			}
			queue = queue.slice(0,mx);
			if(queue.length == 0){
				lwReset();
			}
			// midPick();
			for(x in queue){
				barrageInstance(queue[x][1],queue[x][0],x,queue.length);
			}
			queue = [];
		}

		//飞行弹幕实例化function
		var barrageInstance = function(text,type,nth,allnth) { 
			if(text == ''){
				return;
			}
			if(!lw[min]){
				lw[min] = 0;
			}
			num++;
			linezRepair(allnth);
			getCurrentwidth();
			for(var i = 0; i < ln; i++){ 
				lw[i] = lw[i] ? lw[i] : 0;
			  	if(lw[min] > lw[i]){
			  		min = i;
			  	} 
			}
			if(type == 0){
				var $obj = $("<span class='flying' id='dm" + num + "' style='font-size:" + font + "px;'>" + text + "</span>");
			}else if(type == 1){
				var $obj = $("<span class='flying member' id='dm" + num + "' style='font-size:" + font + "px;'>" + text + "</span>");
			}else{
				return;
			}
			container.append($obj);
			var lw_n = $("#dm"+num).width() + 6;
			$("#dm"+num).css({'right': -lw_n,
							  'width': lw_n,
							    'top': lh*min});
			$("#dm"+num).delay((nth/allnth)*wtime).animate({'right': cw},speed*(1+(Math.random() - 1)*0.2),'linear',function(){
				$(this).remove();
			});
			lw[min] = lw[min] + lw_n + 20;
		}
		
		//小秘书弹幕 中间固定弹幕
		var midPick = function (){
			for(x in queue){
				if(queue[x][0] == 2){
					queue_mid.push(queue[x]);
					queue.splice(x,1);
				}
			}
			if( queue_mid == "" ){
				return;
			}
			for(x in queue_mid){
				num++;
				text = queue_mid[x][1];
				var $obj = $("<span class='hanging' id='dm" + num + "'><em><i>主持人：</i>" + text + "</em></span>");
				container.append($obj);
				lh_m = $("#dm"+ num).height();
				var leave = $("#dm"+num).find('em').width() - cw < 0 ? -12 : $("#dm"+num).find('em').width() - cw;
				for( var i = 0; i <= ln; i++ ){
					if(state_m[i] == 0 || state_m[i] == undefined ){
						$("#dm"+num).css({'top': (lh_m + 5)*i});
						state_m[i] = 1;
						$("#dm"+num).attr('data_index',i);
						$("#dm"+num).delay(2000).animate({'left':-leave-12},5000,'linear',function(){
							$(this).animate({'left':-leave-12},2000,function(){
								$(this).remove();
								state_m[$(this).attr('data_index')] = 0;
							});
						});
						i = ln + 1;
					}
				}
			}
			queue_mid = [];
		}

		//开启弹幕
		this.start = function(){	
			var timego = function(){
				getCurrentwidth();
				barrageEmbed();
				setTimeout(timego, wtime);
			};
			timego();
		};
	}
	
})(window);