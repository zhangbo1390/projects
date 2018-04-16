/***
 * 返回函数
 */     
function goback(back){
    	  if(back=="-1"){
    		  history.go(-1);
    	  }else{
    		  window.location.href = back;
    	  }   	  
 }
/***
 * PC和Touch事件兼容处理
 */
var CLICK = 'click';
function _initTap(){
	var UA = window.navigator.userAgent;
	if(/iphone|ipad|android/.test(UA)){
		CLICK = 'tap';	
	}
}
/***
 * 显示隐藏节点
 */
function showHideNode(showClassName,hideClassName){
	$('.'+showClassName).show();
	$('.'+hideClassName).hide();
	//判断要显示的节点容器为增值服务行李托运或者选餐
	if(showClassName=="Consignment-Wrap" || showClassName=="chooseMeals-Wrap" || showClassName=="chooseSeatWrap"){
		$(".back").attr("onclick","showHideNode('addedServiceWrap','"+showClassName+"')");
		if(showClassName=="Consignment-Wrap"){
			$("#PageTit").text("增值服务 - 我要托运");
		}else if(showClassName=="chooseMeals-Wrap"){
			$("#PageTit").text("增值服务 - 我要选餐");
		}else{
			$("#PageTit").text("增值服务 - 我要选座");
		}
	}else if(showClassName=="addedServiceWrap"){
		$(".back").attr("onclick","goback('-1')");
		$("#PageTit").text("增值服务");
	}else if(showClassName=="fillInOrderWrap"){
		$(".back").attr("onclick","goback('-1')");
		$("#PageTit").text("订单填写");
	}else if(showClassName=="ContainerWrap"){
		$(".back").attr("onclick","goback('-1')");
		$("#PageTit").text("增值服务");
	}else if(showClassName=="total_container"){
        $(".CommonHeader").show();
        $(".fillingWrap").show();
	}
}

/***
 * 切换出发到达城市
 */

function change_city(){
	var orgCity = $("#org").text();
	var orgCode = $("#orgCity1").val();
	var dstCity = $("#reach").text();
	var dstCode = $("#dstCity1").val();
	$("#org").text(dstCity);
	$("#orgCity1").val(dstCode);
	$("#reach").text(orgCity);
	$("#dstCity1").val(orgCode);
}

//获得当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//显示默认的Header
function showDeaultHeader(){
    //是否需要显示默认的Header
    	$(".CommonHeader").show();
    	$(".fillingWrap").show();
}

//loading遮罩
function loading(){
	var loadingHtmlStr='<div id="loadingOver" class="loadingOver"></div><div id="loadingLayout" class="loadingLayout"><div class="load-container load" style="width: 2rem;height: 2rem;float: left;position: relative;overflow: hidden;-moz-box-sizing: border-box;box-sizing: border-box;"><div class="loader" style="-webkit-transform: translateZ(0);-moz-transform: translateZ(0);-ms-transform: translateZ(0);-o-transform: translateZ(0);transform: translateZ(0);"></div><div class="loadingInfo">努力加载中...</div></div></div>';
	$('body').append(loadingHtmlStr);
	$('.loadingOver').css('heihgt',document.body.scrollHeight || document.documentElement.scrollHeight);
	var loadingLayoutWidth = $(".loadingLayout").width();
	var WinWidth = $(window).width();
	var eleLeft = (WinWidth-loadingLayoutWidth)/2;
	$('.loadingLayout').css('left',eleLeft+'px');
	$('html,body').addClass('ovfHiden'); //使网页不可滚动
}

//取消遮罩
function unloading(){
	$('.loadingOver,.loadingLayout').remove();
	$('html,body').removeClass('ovfHiden'); //使网页可滚动
}

//弹窗函数（无回调）
function showMes(mes){
	unloading();
	layer.open({
		shadeClose:false,
	    title: '提示信息',
	    content: mes
	});
}
//页面加载完之前加载
function BeforeShowPage(){
	//获取浏览器页面可见高度和宽度
    var _PageHeight = document.documentElement.clientHeight,
        _PageWidth = document.documentElement.clientWidth;
    //计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
    var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
        _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
    //在页面未加载完毕之前显示的loading Html自定义内容
    var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#f3f8ff;opacity:0.8;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #fff url(/Content/loading.gif) no-repeat scroll 5px 10px; border: 2px solid #95B8E7; color: #696969; font-family:\'Microsoft YaHei\';">页面加载中，请等待...</div></div>';

    //呈现loading效果
    document.write(_LoadingHtml);

    //window.onload = function () {
    //    var loadingMask = document.getElementById('loadingDiv');
    //    loadingMask.parentNode.removeChild(loadingMask);
    //};

    //监听加载状态改变
    document.onreadystatechange = completeLoading;

    //加载状态为complete时移除loading效果
    function completeLoading() {
        if (document.readyState == "complete") {
            var loadingMask = document.getElementById('loadingDiv');
            loadingMask.parentNode.removeChild(loadingMask);
        }
    }
}
/***
 * 
 * 时间戳转换函数
 * @return YYYY-MM-DD
 * 
 * */
function formatDate(d)   { 
		  var dates=new Date(d);    
	      var  year=dates.getFullYear();     
	      var  month=dates.getMonth()+1;       
	      var  date=dates.getDate();             
	      return  year+"-"+month+"-"+date;       
      }  

/**
 * 获得今天的时间日期函数
 * 
 */
function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m;//获取当前月份的日期 
	var d;
	if((dd.getMonth()-0+1)>=10){
    	m = dd.getMonth()-0+1;
    }else{
    	m = "0"+(dd.getMonth()-0+1);
    }

    if((dd.getDate()-0)>=10){
    	d = dd.getDate();
    }else{
    	d = "0"+dd.getDate();
    };
	return y+"-"+m+"-"+d; 
	} 

/**
* 求出指定日期的后一天
*/
function getNextDay(d){
        d = new Date(d);
        d = +d + 1000*60*60*24;
        d = new Date(d);
        var mon,
        	day;

        if((d.getMonth()-0+1)>=10){
        	mon = d.getMonth()-0+1;
        }else{
        	mon = "0"+(d.getMonth()-0+1);
        };

        if((d.getDate()-0)>=10){
        	day = d.getDate();
        }else{
        	day = "0"+d.getDate();
        };
        //return d;
        //格式化
        return d.getFullYear()+"-"+mon+"-"+day;   
    }
/**
 * 检测浏览器是否支持本地存储
 * 
 */
function supports_local_storage(){
    return ('localStorage' in window) && window['localStorage'] != null;
}

/***
* 价格日历价格显示
* 
**/
function showCalendarPrice(priceUrl,_priceOrgCity,_priceDstCity,_priceOrgDate){
        //请求价格数据     
        var PriceData = '';
        $.ajax({                    
                 url:priceUrl,
                 data:{orgCity1:_priceOrgCity,dstCity1:_priceDstCity,depDate:_priceOrgDate},  
                 type:'post',  
                 async:false,  
                 dataType:'json',  
                 success:function(getdata) {
                  console.log(getdata.prices);
                  PriceData = getdata.prices;
                  },  
                error:function() {
                    
                  }  
        });
        //解析数据到DOM节点
        if(!PriceData) {
            return;
        }
        $.each(PriceData, function(item, i){
            //console.log(item+"-->"+i);
            if(!$('td[data-date="'+item+'"]', $(".showDateWarp")).hasClass('disabled')) {
                $('td[data-date="'+item+'"]', $(".showDateWarp")).find('.bottom-center').remove();
                $('td[data-date="'+item+'"]').append('<span class="bottom-center price '+(i ? 'special' : '')+'">'+"￥"+i+'</span>');
            }
        })
}