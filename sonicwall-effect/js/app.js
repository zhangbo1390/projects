/**
 * Created by XbZhang on 2018/1/4.
 */
var ft,sw,sh,w,h;
var rate = 1.78; //高宽初始比例
var YHeight = window.pageYOffset; //滚动条距离顶部的 距离
var WHeight,WinWidth;

$(function(){
    font_resize();
    start();

    /*var wHei = $('body').height();//获取页面高度
    var index = 0;
    var Time = new Date();
    $(window).mousewheel(function(event,delta,deltaX,deltaY){

        /!*
         * event : event事件
         * delta : 参数，获取滚轮向上滚动还是向下滚动 向下 负值 // 向上 正值
         * deltaX,deltaY : 滚动坐标
         *!/
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
    });*/
});



function start(){
    $('.snwl-part-1-3').addClass('first');
    init();
    /* 刷新，滚动到顶部 */
    setTimeout(function(){
        $(document).scrollTop(0);
    },500);
    $(window).resize(function(){
        var WHeight_R = $(window).height();
        var WinWidth_R = $(window).width();
        if(WinWidth_R/WHeight_R<rate){
            //WHeight = WinWidth_R/rate;
            WinWidth = WinWidth_R;
        }
        else if(WinWidth_R/WHeight_R > rate){
            var temp = WinWidth;
            WinWidth = rate * WHeight_R;
        }
        $('.part').css({
            'height':WHeight,
            'width':WinWidth,
            'margin-left':'auto',
            'margin-right':'auto'
        });
        scroll_down();
        part2_right_side_position('#panel1c');
        part2_right_side_position('#panel2c');
        font_resize();

    });
    scroll_down(WHeight);
    part2_right_side_position('#panel1c');
    part2_right_side_position('#panel2c');
    part3_right_side_position();

}

/*=================================   初始化每页的 高，宽   =================================*/
function init(){
    WHeight = $(window).height();
    WinWidth = $(window).width();
    console.log(WinWidth/WHeight);
    /*if(WinWidth/WHeight<rate){
        WHeight = WinWidth/rate;
    }
    else if(WinWidth/WHeight > rate){
        var temp = WinWidth;
        WinWidth = rate * WHeight;
        WHeight =temp/rate;
    }*/
    if(WinWidth/WHeight>2){
        $('.snwl-product').css({'width':'30rem'});
        $('.snwl-desc').css({'margin':'1rem auto'});
        $('.snwl-part-1-3').css({'margin-top':'9rem'});


    }

    $('.part').css({
        'height':WHeight,
        'width':WinWidth,
        'margin-left':'auto',
        'margin-right':'auto'
    });
}

/*=================================   font resize   =================================*/
function font_resize(){
    ft = document.getElementsByTagName("html")[0];//获取到html标签
    sw = window.screen.width;//获取屏幕的宽度
    sh = window.screen.height;//获取屏幕的高度
    w = document.body.offsetWidth;//获取浏览器内容的宽度
    h = document.body.offsetHeight;//获取浏览器内容的高度
    ft.style.fontSize = w/sw*16 +"px";
}

function scroll_down(WHeight){
    $('a.scroll-down').click(function(){
        $('html,body').animate({'scrollTop':WHeight},1000);
    });
}
interval();
/* ===================  part2 right side position and size ========================= */
function part2_right_side_position(id){
    var width = 0;
    $(id).find('.snwl-asset-box div').eq(0).css({
        'left': $('.tabs-content').position().left/16- 7+'rem',
        'top': $('.tabs-content').position().top/16 + 21+'rem'
    });
    $(id).find('.snwl-asset-box div').eq(1).css({
        'left': $('.tabs-content').position().left/16+11.1+'rem',
        'top': $('.tabs-content').position().top/16 + 3.5+'rem'
    });
    $(id).find('.snwl-asset-box div').eq(2).css({
        'left': $('.tabs-content').position().left/16+41.7+'rem',
        'top': $('.tabs-content').position().top/16 + 21+'rem'
    });
    $(id).find('.snwl-asset-box div').eq(3).css({
        'left': $('.tabs-content').position().left/16+28+'rem',
        'top': $('.tabs-content').position().top/16 + 6+'rem'
    });
    $(id).find('.snwl-asset-box div').eq(4).css({
        'left': $('.tabs-content').position().left/16+19+'rem',
        'top': $('.tabs-content').position().top/16 + 23.5+'rem'
    });
}


/* ===================  part3 right side position  ========================= */
function part3_right_side_position(){
    for(var j=1;j<4;j++){
        for(var i=0;i<9;i++){
            $('.snwl-part-3-1-right-layer').after('<div class="snwl-part-3-1-right-ellipse-'+j+'" id="ellipse-4-'+(8-i)+'" style="z-index: '+(8-i)+';"><img src="img/ellipse-4-'+(8-i)+'-full.png"></div>');
        }
    }

    setTimeout(function(){
        $('.snwl-part-3-1-right-ellipse-1').each(function(){
            var w = $(this).find('img').width();
            $(this).css({
                'width':w/2,
                'left':($('.snwl-part-3-1-right-ellipse-1').length - $(this).index()-1)*20+350,
                'top':(90+($('.snwl-part-3-1-right-ellipse-1').length-$(this).index()-1)*3)+'%'
            });
        })
    },0);

    setTimeout(function(){
        $('.snwl-part-3-1-right-ellipse-2').each(function(){
            var w = $(this).find('img').width();
            $(this).css({
                'width':w/2,
                'left':($('.snwl-part-3-1-right-ellipse-2').length - $(this).index()-1)*20+400,
                'top':(30+($('.snwl-part-3-1-right-ellipse-2').length-$(this).index()-1)*3)+'%'
            });
        })
    },0);


    setTimeout(function(){
        $('.snwl-part-3-1-right-ellipse-3').each(function(){
            var w = $(this).find('img').width();
            $(this).css({
                'width':w/2,
                'left':($('.snwl-part-3-1-right-ellipse-3').length - $(this).index()-1)*20+400,
                'top':(30+($('.snwl-part-3-1-right-ellipse-3').length-$(this).index()-1)*3)+'%'
            });
        })
    },0);
}


