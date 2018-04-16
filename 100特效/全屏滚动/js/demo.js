

$(function(){
	
	var wHei = $('body').height();//获取页面高度
	var index = 0;
	var Time = new Date();
	setTimeout(function(){
		$(document).scrollTop(0);
	},50);
	$('div.part1').addClass('first');


	$(window).resize(function(){
		 wHei = $('body').height();
		 $(document).scrollTop(index*wHei);
	});

	$(window).mousewheel(function(event,delta,deltaX,deltaY){
		
		/*
			* event : event事件
			* delta : 参数，获取滚轮向上滚动还是向下滚动 向下 负值 // 向上 正值
			* deltaX,deltaY : 滚动坐标
		*/
		if (new Date()-Time>800)
		{
			Time = new Date();
			delta==-1?index++:index--;
			if(index>6){index=6};
			if(index<0){index=0};
			$('div.part').eq(index).siblings().removeClass('on');
			$('div.nav ul li').eq(index).addClass('on').siblings().removeClass('on');
			$('body,html').animate({'scrollTop':wHei*index},800,function(){
				$('div.part').eq(index).addClass('on');
			});
		}
	});

	$("div.nav ul li").click(function(){
		index = $(this).index();
		$('div.part').eq(index).siblings().removeClass('on');
		$('div.nav ul li').eq(index).addClass('on').siblings().removeClass('on');
		$('body,html').animate({'scrollTop':wHei*index},800,function(){
			$('div.part').eq(index).addClass('on');
		});
	});





















});