$(function() {
	var barrage = new barrageCreate($('#id_video_container')); //实例化 
	barrage.start(); //开启

	setInterval(function(){
		$.post('js/barrage.json',function(data) {
			barragePush(0, data.msg);
		})
	},1500);
	

	function barragePush(type, msg) {
		barrage.pushData([type, msg]);
	}
})