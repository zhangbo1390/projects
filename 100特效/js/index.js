/**
 * Created by Zhangxuebo on 2016/3/31.
 */
var liNum = 5*5*5;
$(function(){
    init();
});
function init(){
    var $main = $('.main');
    var $mask = $('.mask');
    for(var i=0;i<liNum;i++){
        var x = Math.floor((Math.random()-0.5)*5000);
        var y = Math.floor((Math.random()-0.5)*5000);
        var z = Math.floor((Math.random()-0.5)*5000);//demoArr   {'title':'JS','author':'张学卜','time':'2016-4-7','src':''},
        var $li = $('<li><h1>'+ demoArr[i].title +'</h1><p>'+ demoArr[i].author +'</p><p>'+ demoArr[i].time +'</p></li>');
        $li.css({
            'transform':'translate3D('+ x +'px,'+ y +'px,'+ z +'px)'
        });
        $main.append($li);
    }
    setTimeout(grid,300);
    //拖拽
    (function(){
        var x, y,x_,y_,difX=0,difY=0;
        var rotX = 0,rotY = 0,tZ = -2000;
        var timer1 = null;
        var timer2 = null;
        $(document).mousedown(function(e){
            clearInterval(timer1);
            var e = e || event;
            x = e.clientX;
            y = e.clientY;
            $(document).on('mousemove',function(ev){
                var ev = ev || event;
                x_ = ev.clientX;
                y_ = ev.clientY;
                difX = x_ - x;
                difY = y_ - y;
                rotX += difX*0.2;
                rotY -= difY*0.2;
                $main.css({
                    'transform':'translateZ('+ tZ +'px) rotateX('+ rotY +'deg) rotateY('+ rotX +'deg)'
                });
                x = x_;
                y = y_;
            });
        }).mouseup(function(){
            $(this).off('mousemove');
            timer1=setInterval(function(){
                difX *= 0.95;
                //console.log(difX);
                difY *= 0.95;
                if(Math.abs(difX)<0.5 && Math.abs(difY)<0.5)clearInterval(timer1);
                rotX += difX*0.2;
                rotY -= difY*0.2;
                $main.css({
                    'transform':'translateZ('+ tZ +'px) rotateX('+ rotY +'deg) rotateY('+ rotX +'deg)'
                });
                x = x_;
                y = y_;
            },13);

        }).mousewheel(function(){
            clearInterval(timer2);
            var data = arguments[1];
            tZ += data*80;
            tZ = Math.min(0,tZ);//Math.min()  去参数里面最小的
            tZ = Math.max(tZ,-8000);//Math.max()  取参数里最大的一个
            $main.css({
                'transform':'translateZ('+ tZ +'px) rotateX('+ rotY +'deg) rotateY('+ rotX +'deg)'
            });
            timer2 = setInterval(function(){
                data *= 0.8;
                if (Math.abs(data)<0.01)clearInterval(timer2);
                //console.log(data);
                tZ += data*80;
                tZ = Math.min(0,tZ);//Math.min()  去参数里面最小的
                tZ = Math.max(tZ,-8000);//Math.max()  取参数里最大的一个
                $main.css({
                    'transform':'translateZ('+ tZ +'px) rotateX('+ rotY +'deg) rotateY('+ rotX +'deg)'
                });
            },13)
        });
    })();

    $('.styleBtn li').on('click',function(){
        var index = $(this).index();
        switch (index){
            case 0:
                table();
                break;
            case 1:
                sphere();
                break;
            case 2:
                helix();
                break;
            case 3:
                grid();
                break;
        }
    });
    $('.main li').on('click',function(ev){
        var ev = ev || event;
        $mask.fadeIn(1000).css({
            'transform':'rotateY(0deg) scale(1)'
        });
        ev.stopPropagation();
    });
    $(document).click(function(){
        $mask.fadeOut(1000,function(){
            $(this).css({
                'transform':'rotateY(0deg) scale(1.5)'
            })
        }).css({
            'transform':'rotateY(180deg) scale(0.1)'
        })
    });
    $mask.on('click',function(ev){
        $('.wrap').stop().animate({
            'marginLeft':'-100%'
        },1000);
        $('.frame').show().stop().animate({
            'left':'0px'
        },1000).find('iframe').attr('src','demo/3D drag/index.html');
        ev.stopPropagation();
    });
    $('.back').on('click',function(){
        $('.wrap').stop().animate({
            'marginLeft':'0'
        },1000,function(){
            $('.mask').css({
                'transform':'rotateY(0deg) scale(1.5)',
                'display':'none'
            })
        });
        $('.frame').stop().animate({
            'left':'100%'
        },1000);
    })
}
function grid(){
    var tX = 400,tY = 400,tZ = 800;//水平，垂直间隔
    var firstX = -2*tX,
        firstY = -2*tY,
        firstZ = -2*tZ;//第一个li的水平垂直偏移量
    $('.main li').each(function(i){
        var iX = (i%25)%5; //X方向要增加的倍数
        var iY = parseInt((i%25)/5); //Y方向要增加的倍数
        var iZ = parseInt(i/25);//
        $(this).css({
            'transform':'translate3D(' + (firstX+iX*tX) + 'px,'+ (firstY+iY*tY) +'px,'+ (firstZ+iZ*tZ) +'px)',
            'transition':'4s ease-in-out'
        });
    });
}
function helix(){
    var rotY = 10,tY = 10;
    var mIndex = Math.floor($('.main li').length/2);
    var firstTy = -tY*mIndex;
    $('.main li').each(function(i){
        $(this).css({
            'transform':'rotateY('+ rotY*i +'deg) translateY('+ (firstTy+tY*i) +'px) translateZ(1000px)'
        });
    });
}
function sphere(){
    var arr = [1,4,8,10,12,17,22,16,14,9,6,5,1];
    var roX = 180/arr.length;
    var fisrtRoX = 90;
    $('.main li').each(function(j){
        var sum = 0;
        var index , num; //index 序列 num 第几个
        for ( var i=0;i<arr.length;i++ )
        {
            sum += arr[i];
            if ( sum >= j+1 )
            {
                index = i;
                num = arr[i] - (sum-j);
                break;
            }
        }
        var roY = 360/arr[index];
        var x = index%2?fisrtRoX+index*roX:fisrtRoX-index*roX;
        var y = num*roY;
        var z = 0;
        if ( x > 90 && x < 270 )
        {
            z = 180;
        }
        $(this).css({
            transform : 'rotateY('+y+'deg) rotateX('+x+'deg) rotateZ('+z+'deg) translateZ(800px)'
        });
    });

}
function table(){
    var tX = 160,tY = 200;
    var firstX = -9*tX+67;
    var firstY = -4*tY;
    var arr = [
        {x:firstX,y:firstY},
        {x:firstX+17*tX,y:firstY},
        {x:firstX , y:firstY+tY },
        {x:firstX+tX , y:firstY+tY},
        {x:firstX+12*tX , y:firstY+tY },
        {x:firstX+13*tX , y:firstY+tY },
        {x:firstX+14*tX , y:firstY+tY },
        {x:firstX+15*tX , y:firstY+tY },
        {x:firstX+16*tX , y:firstY+tY },
        {x:firstX+17*tX , y:firstY+tY },
        {x:firstX , y:firstY+tY*2 },
        {x:firstX+tX , y:firstY+tY*2},
        {x:firstX+12*tX , y:firstY+tY*2 },
        {x:firstX+13*tX , y:firstY+tY*2 },
        {x:firstX+14*tX , y:firstY+tY*2 },
        {x:firstX+15*tX , y:firstY+tY*2 },
        {x:firstX+16*tX , y:firstY+tY*2 },
        {x:firstX+17*tX , y:firstY+tY*2 }
    ];
    $('.main li').each(function(i){
        var x,y;
        if(i<18){
            x = arr[i].x;
            y = arr[i].y;
        }else {
            var iX = (i+18)%18;
            var iY = parseInt((i+18)/18)+1;
            x = firstX+iX*tX;
            y = firstY+iY*tY;
        }

        $(this).css({
            'transform':'translate('+ x +'px,'+ y +'px)'
        })
    });
}