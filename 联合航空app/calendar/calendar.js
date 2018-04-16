/**
 * 日历插件，可正常按月显示日历，可设置可选择日期范围，特殊处理单选和出发、到达日期
 * @author 米梦宇
 * @editor 2016-04-18
 */

    /**
     * 默认配置
     * @type {Object}
     */
    var calendarConfig = {
        display: 12, // 展示多少个月的日历
        canBeSelected: '', // 设置可选择日期范围
        type: '', // 日历类型 1.单程日历 single 2.往返日历 multiple
        dateType:'', //出发城市或者到达城市
        callback: function() {}, // 选择日期后的回调函数
        el: '', // 渲染节点
        multipleType:'',//往返程时需传入 1.去程 go 2.返程 back
        hideEl:'', //要隐藏的节点
        showDateEle:'',//要显示选择时间的节点
        saveDateEle:'',//要存储选择时间的节点
        showReachDateEle:'',//要显示选择的返程时间的节点 
        saveReachDateEle:'',//要存储选择的返程时间的节点
        
        splitStr: '~', // 日历分割符
        isNeedSubmit:false, //是否需要选择完日期直接提交表单
        isNeedSubmitName:'', //要提交表单的ID
        isNeedHideHeader:false,//是否需要隐藏默认的Header
        isDynamic:false,//控件是否用于航班动态,只显示前后两天的时间
        isOrderQuery:false,//控件是否用于查询历史订单,只显示前30天的时间
        priceUrl:getRootPath() + '/book/queryPriceCalendar.json',  //价格数据的JSON地址
        priceOrgCity:'',//价格日历起始城市
        priceDstCity:'',//价格日历到达城市
        priceOrgDate:'',//初始日期
        isChangeDate:false, //控件是否用于不正常改期,只显示前后十四天的时间
        defaultDate:'',//不正常改期取消航班的日期
        bottom_center: function() {
            if(this.settings.type == 'multiple') {
                var selectDate = this._getSelectedDate();
                if(selectDate.length == 1) {
                    return '<span class="goTip">去</span>';
                } else {
                    return '<span class="backTip">返</span>';
                }
            } else {
                return '';
            }
        }, // 往返日历时的特殊处理
        dateArea: 29, // 往返日历最多可选天数
        currentDate: '', // 当前日期
        holidays: {
            '2016-01-01': '元旦',
            '2016-02-07': '除夕',
            '2016-04-04': '清明',
            '2016-05-01': '劳动',
            '2016-06-09': '端午',
            '2016-09-15': '中秋',
            '2016-10-01': '国庆',
            '2016-12-25': '圣诞',
            '2017-01-01': '元旦',
            '2017-01-27': '除夕',
            '2017-04-04': '清明',
            '2017-05-01': '劳动',
            '2017-05-30': '端午',
            '2017-10-04': '中秋',
            '2017-10-01': '国庆',
            '2017-12-25': '圣诞',
            '2018-01-01': '元旦',
            '2018-02-15': '除夕',
            '2018-04-05': '清明',
            '2018-05-01': '劳动',
            '2018-06-18': '端午',
            '2018-09-24': '中秋',
            '2018-10-01': '国庆',
            '2018-12-25': '圣诞'
        } //写死三年，这个日历插件应该不会用超过三年...
    };

    /**
     * 日期工具类
     * @type {{add: Function, format: Function, compare: Function}}
     */
    var dateExtend = {
        /**
         * 增加或减少多少天
         * @param int day 负数表示－多少天，正数表示＋多少天
         */
        add: function(date, day) {
            return new Date(+new Date(date) + (parseInt(day, 10) || 0)*24*60*60*1000);
        },

        /**
         * 格式化日期
         * @param  {[type]} format  YYYY-MM-DD hh:mm:ss
         * @return {[type]}        [description]
         */
        format: function(date, fmt) {
            date = new Date(date);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "D+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(Y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }

            return fmt;
        },

        /**
         * 比较两个日期的大小
         * @param  {[type]} odate 被比较的日期
         * @return {[type]}       相差的豪秒数
         */
        compare: function(date, odate) {
            return +new Date(date) - (+new Date(odate) || 0);
        },
        /**
         *获取今天在页面中显示的位置
         *@param  URL priceUrl 价格数据的JSON URL
         *
         */
        getTodayIndex:function(){
    		for(var m=0;m<=$('td').length;m++){
    			if($('td').eq(m).attr('class')){
        			if($('td').eq(m).attr('class').indexOf('today')!=-1){
        				var TodayIndex = m;
        			}
    			}
    		}
    		return TodayIndex;
        },
        /**
         *获取价格的数据
         *@param  URL priceUrl 价格数据的JSON URL
         *
         */
        // getPriceData:function(priceUrl,_priceOrgCity,_priceDstCity,_priceOrgDate){
        // 	PriceData = '';
        // 	console.log(_priceOrgDate);
        //         $.ajax({                    
        //                  url:priceUrl,
        //                  data:{orgCity1:_priceOrgCity,dstCity1:_priceDstCity,depDate:_priceOrgDate},  
        //                  type:'post',  
        //                  async:false,  
        //                  dataType:'json',  
        //                  success:function(getdata) {
        //                 	 //console.log(getdata.prices);
        //                 	 PriceData = getdata.prices;
        //                   },  
        //                 error:function() {
                        	
        //                   }  
        //         });
        //       return PriceData;
        // }
    };

    function Calendar(options) {
        this._init(options);
    }

    Calendar.prototype = {
        /**
         * 页面初始化
         * @return {[type]} [description]
         */
        _init: function(options) {
            // 初始化
            this._initSettings(options);
            // 可选择日期范围
            this._initCanBeSelected();
            // 确定display
            this._setDisplay();
            // 生成日历
            this._showCalendar();
            // 航班动态
            this._showDynamicCalendar();
            //订单查询
            this._OrderQueryCalendar();
            // 不正常改期
            this._changeDateCalendar();
            //显示价格
            //this.load();
            // 绑定事件
            this._bindEvent();
            
        },

        /**
         * 初始化设置
         * @private
         */
        _initSettings: function(options) {
            this.settings = $.extend({}, calendarConfig, options);
        },

        /**
         * 生成日历
         * @return {[type]} [description]
         */
        _showCalendar: function() {
            // 增加头部和星期
        	if(this.settings.isNeedHideHeader){
                var weekstr = '<div class="header"><div class="back"  onclick="showDeaultHeader();showHideNode(\''+this.settings.hideEl+'\',\''+this.settings.el+'\')"></div>日期选择</div><!-- 顶部用了fixed，加入层撑开内容区 --><div class="fillingWrap"></div><div class="headerWeek tn-calendar-head"><table><tbody><tr><th>SUN<br/>日</th><th>MON<br/>一</th><th>TUE<br/>二</th><th>WED<br/>三</th><th>THU<br/>四</th><th>FRI<br/>五</th><th>SAT<br/>六</th></tr></tbody></table></div>';
        	}else{
                var weekstr = '<div class="header"><div class="back"  onclick="showHideNode(\''+this.settings.hideEl+'\',\''+this.settings.el+'\')"></div>日期选择</div><!-- 顶部用了fixed，加入层撑开内容区 --><div class="fillingWrap"></div><div class="headerWeek tn-calendar-head"><table><tbody><tr><th>SUN<br/>日</th><th>MON<br/>一</th><th>TUE<br/>二</th><th>WED<br/>三</th><th>THU<br/>四</th><th>FRI<br/>五</th><th>SAT<br/>六</th></tr></tbody></table></div>';
        	}
            var render = [];
            // 计算当前年月日
            var curDate = this.curDate = (this.settings.currentDate && new Date(this.settings.currentDate)) || new Date();
            var dateArr=dateExtend.format(curDate,'YYYY-MM-DD').split('-');
            // 循环生成日历
            for(var i = 0; i < this.settings.display; i ++) {
            	if(this.settings.isOrderQuery){
            		render.push(this._render(curDate.getFullYear(), curDate.getMonth()-1 + i));
            	}else{
                    if(this.settings.isDynamic || this.settings.isChangeDate){
                        if(dateArr[2] == '01'|| dateArr[2] == '02'){
                            render.push(this._render(curDate.getFullYear(), curDate.getMonth()-1 + i));
                        }else{
                        	 render.push(this._render(curDate.getFullYear(), curDate.getMonth() + i));
                        }
                    }else{
                        render.push(this._render(curDate.getFullYear(), curDate.getMonth() + i));
                    }
        		}
            }
            //是否需要隐藏默认的Header
            if(this.settings.isNeedHideHeader){
            	$(".CommonHeader").hide();
            	$(".fillingWrap").hide();      	
            }
            $('.'+this.settings.el).append(weekstr + '<div class="tn-container">'+render.join('')+'</div>');
            
        },
        
        //是否显示不正常改期航班日历控件
        _changeDateCalendar:function(){
            if(this.settings.isChangeDate){
            	//获取不正常改期要取消的航班日期
                var cancleDate = this.settings.defaultDate;
               // alert(cancleDate);
                //遍历节点
                for(var n=0;n<=$('td').length;n++){
                    if($('td').eq(n).text()!=''){//遍历所有td 不为空的添加属性data-unnull
                        $('td').eq(n).attr('data-unnull','');
                        if($('td').eq(n).attr('data-date')==cancleDate){ //查找要取消的航班，添加cancleDate标识
                        	$('td').eq(n).addClass('cancleDate');	
                        }
                    };
                }
                //获取今天在整个不为空的td中的位置坐标
                for(var i=0;i<=$('td[data-unnull]').length;i++){
                    if($('td[data-unnull]').eq(i).attr('class')){
                        if($('td[data-unnull]').eq(i).attr('class').indexOf('cancleDate')!=-1){
                            var cancleDateIndex = i;
                        }else if($('td[data-unnull]').eq(i).attr('class').indexOf('today')!=-1){
                            var TodayIndex = i;
                        }
                    }
                }
                //console.log(cancleDateIndex);
               // console.log(TodayIndex);
                //如果当前日期在被取消航班前n（n>=14）日内，则被取消航班前后14日均可选，其他日期置灰不可选；
                if((cancleDateIndex-TodayIndex)>=14){
                    //遍历所有的不为空的td，设置除去今天及前后两天之外的天数不可选                  
                    minDay = cancleDateIndex-0-14;
                    maxDay = cancleDateIndex-0+14;
                }else if((TodayIndex>(cancleDateIndex-14))&&TodayIndex<cancleDateIndex){
                //如果当前日期在被取消航班前n（n<14）日内，则被取消航班前n天可选后14日均可选，其他日期置灰不可选；
                    minDay = TodayIndex;
                    maxDay = cancleDateIndex-0+14;
                }
                var SelectedDynamic = [];
                //追加可选日期的坐标
                for(var m=minDay;m<maxDay;m++){
                	SelectedDynamic.push(m);
                }
                //console.log(SelectedDynamic);
                for(var m=0;m<=$('td[data-unnull]').length;m++){
                    if(SelectedDynamic.indexOf(m)==-1){
                        $('td[data-unnull]').eq(m).addClass("disabled");
                        $('td[data-unnull]').eq(m).children('p').addClass('changeFront');
                    }else if($('td[data-unnull]').eq(m).attr('class')){
                        if($('td[data-unnull]').eq(m).attr('class').indexOf('disabled')!=-1){
                            $('td[data-unnull]').eq(m).removeClass("disabled");
                            $('td[data-unnull]').eq(m).html('<p>'+$('td[data-unnull]').eq(m).text()+'</p>');
                        }
                    }
                }
                
            }
        },
        //是否显示航班动态
        _showDynamicCalendar:function(){
        	if(this.settings.isDynamic){
                //获取今天在整个td中的位置坐标
                /*for(var m=0;m<=$('td').length;m++){
                    if($('td').eq(m).attr('class')){
                        if($('td').eq(m).attr('class').indexOf('today')!=-1){
                            var TodayIndex = m;
                        }
                    }
                }
                //遍历所有的td，设置除去今天及前后两天之外的天数不可选
                var SelectedDynamic = [TodayIndex-2,TodayIndex-1,TodayIndex,TodayIndex+1,TodayIndex+2];
                for(var m=0;m<=$('td').length;m++){
                    if(SelectedDynamic.indexOf(m)==-1){
                        $('td').eq(m).addClass("disabled");
                        $('td').eq(m).children('p').addClass('changeFront');
                    }else if($('td').eq(m).attr('class')){
                        if($('td').eq(m).attr('class').indexOf('disabled')!=-1){
                            $('td').eq(m).removeClass("disabled");
                            $('td').eq(m).html('<p>'+$('td').eq(m).text()+'</p>');
                        }
                    }
                }*/
                for(var n=0;n<=$('td').length;n++){
                    if($('td').eq(n).text()!=''){//遍历所有tr 不为空的添加属性data-unnull
                        $('td').eq(n).attr('data-unnull','');
                    }
                }
                //获取今天在整个不为空的td中的位置坐标
                for(var i=0;i<=$('td[data-unnull]').length;i++){
                    if($('td[data-unnull]').eq(i).attr('class')){
                        if($('td[data-unnull]').eq(i).attr('class').indexOf('today')!=-1){
                            var TodayIndex = i;
                        }
                    }
                }
                //遍历所有的不为空的td，设置除去今天及前后两天之外的天数不可选
                var SelectedDynamic = [TodayIndex-2,TodayIndex-1,TodayIndex,TodayIndex+1,TodayIndex+2];
                for(var m=0;m<=$('td[data-unnull]').length;m++){
                    if(SelectedDynamic.indexOf(m)==-1){
                        $('td[data-unnull]').eq(m).addClass("disabled");
                        $('td[data-unnull]').eq(m).children('p').addClass('changeFront');
                    }else if($('td[data-unnull]').eq(m).attr('class')){
                        if($('td[data-unnull]').eq(m).attr('class').indexOf('disabled')!=-1){
                            $('td[data-unnull]').eq(m).removeClass("disabled");
                            $('td[data-unnull]').eq(m).html('<p>'+$('td[data-unnull]').eq(m).text()+'</p>');
                        }
                    }
                }
        	}
        },
        //订单查询
        _OrderQueryCalendar:function(){
        	if(this.settings.isOrderQuery){
        		//alert("执行订单查询");
        		//alert(dateExtend.getTodayIndex());
        		var cacheArr = new Array();
        		for(var i=0;i<dateExtend.getTodayIndex();i++){
        			cacheArr[i]=i;
        		}
        		//console.log(cacheArr);
        		cacheArr = cacheArr.slice(-31);
                 for(var m=0;m<=$('td').length;m++){
                     if(cacheArr.indexOf(m)==-1){
                         //$('td').eq(m).addClass("disabled");
                         //$('td').eq(m).children('p').addClass('changeFront');
                     }else if($('td').eq(m).attr('class')){
                         if($('td').eq(m).attr('class').indexOf('disabled')!=-1){
                             $('td').eq(m).removeClass("disabled");
                             $('td').eq(m).html('<p>'+$('td').eq(m).text()+'</p>');  
                         }
                     }
                 }
        	}
        },
        _setDisplay: function() {
            var self = this,
                settings = self.settings,
                canBeSelected = self.canBeSelected;

            if(canBeSelected.length) {
                var sortArr = canBeSelected.sort(function(a, b) {
                    return dateExtend.compare(a, b) > 0 ? 1 : -1;
                });
                
                var endDate = new Date(sortArr[sortArr.length - 1]);
                var startDate = new Date(sortArr[0]);

                var months = endDate.getMonth() - startDate.getMonth() + 1 + (endDate.getFullYear() - startDate.getFullYear()) * 12;

                if(!settings.display) {
                    settings.display = months;
                }
            }
        },

        /**
         * 日历的主体函数
         * @param  {[type]} y [description]
         * @param  {[type]} m [description]
         * @return {[type]}   [description]
         */
        _render: function(y, m) {
            // 日历头部
            var thead = ['<div class="tn-item-container"><div class="tn-c-header"><span class="tn-c-title">', '', '</span></div>'];
            var ths = ['<div class="tn-c-body"><table>'];

            // 日历头部
            var cbody = this._getTds(y ,m);
            thead[1] = cbody.thead;
            ths = ths.concat(cbody.trs);

            // 闭合标签
            ths.push('</table></div></div>');
            
            return thead.concat(ths).join('');
        },

        /**
         * 日历主体函数
         * @param  {[type]} y [description]
         * @param  {[type]} m [description]
         * @return {[type]}   [description]
         */
        _getTds: function(y, m) {
            // 日历主体部分
            var date = new Date(y, m, 1);
            // 获取当月第一天星期几
            var fday = date.getDay();
            date = new Date(y, m + 1, 0);
            // 获取当月的天数
            var aday = date.getDate(),
                ayear = date.getFullYear(),
                amonth = date.getMonth();

            var tds = ['<tr>'],
                trs = [];
            // 计算当前多少日
            var iday, curday,
                curDate = this.curDate,
                dateArea = this.canBeSelected,
                stop = false;
            for(var i = 1; i <= 42; i++) {
                iday = i - fday;
                curday = ayear + '-' + (amonth < 9 ? '0' : '') + ( amonth + 1 ) + '-' + (iday <= 9 ? '0' : '') + iday;
                if(i > fday && i <= (aday + fday)) {
                    var holidayStr = this.settings.holidays[curday] || '';
                    // 当前日期
                    if(iday === new Date().getDate() && ayear === new Date().getFullYear() && amonth == new Date().getMonth()) {
                        // 是否在可选择范围内
                        if(dateArea.length && dateArea.indexOf(curday) == -1) {
                            tds.push('<td class="today disabled" data-date="'+curday +'"><p>今天</p></td>');
                        } else {
                            tds.push('<td class="today" data-date="'+curday +'"><p>今天</p></td>');
                        }
                    // 过去的日期
                    } else if(dateExtend.compare(curDate, curday) > 0 || (dateArea.length && dateArea.indexOf(curday) == -1)) {
                        //console.log(new Date(curday).getDay());
                        tds.push('<td class="disabled" data-date="'+curday +'">'+ iday +'</td>');
                    //判断是否周六日
                    }else {
                        //判断是否为周六日
                        if(new Date(curday).getDay()==0 || new Date(curday).getDay()==6){
                            // 是否设置了可选日期                       
                            tds.push('<td data-date="'+curday+'">'+'<p class="sundays">'+(holidayStr ? holidayStr : iday)+'</p></td>');   
                        }else{
                            // 是否设置了可选日期                       
                            tds.push('<td data-date="'+curday+'">'+(holidayStr ? ('<p class="sundays">'+holidayStr+'</p>') : ('<p>'+iday+'</p>'))+'</td>'); 
                        }

                    }
                } else if(!stop){
                    tds.push('<td></td>');
                }

                if( i % 7 === 0 && !stop) {
                    tds.push('</tr>');
                    trs = trs.concat(tds);

                    // 大于的日期不再换行
                    if(i >= (aday + fday)) {
                        stop = true;
                    }
                    !stop && (tds = ['<tr>']);
                }
            }

            // 设置头部
            // var months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
            // var thead = months[amonth] + '月&nbsp;&nbsp;&nbsp;&nbsp;' + ayear;
            //定义英文月份数组
            var EnMonArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var thead = ayear + ' / ' + (amonth+1) + '月'+' '+EnMonArray[amonth];

            return {
                trs: trs,
                thead: thead
            };
        },

        /**
         * 获取可选择日期，‘，’分割表示单个日期，‘~’分割表示日期段
         * @return {[type]} [description]
         */
        _initCanBeSelected: function() {
            var canSelsArr = [],
                canBeSels = this.settings.canBeSelected;
            if(!canBeSels) {
                this.canBeSelected = canSelsArr;
                return;
            }

            canSelsArr = canBeSels.split(',');
            // 分割符
            var splitStr = this.settings.splitStr;
            canSelsArr.forEach(function(item, i) {
                var area = item.split(splitStr);
                if(area.length == 1) {
                    return;
                }
                var min = area[0],
                    max = area[1];

                // 交换最大日期和最小日期
                if(dateExtend.compare(min, max) > 0) {
                    min = area[1];
                    max = area[0];
                }

                var tem = new Date(min);
                while(dateExtend.compare(tem, max) <= 0) {
                    var fmtDate = dateExtend.format(tem, 'YYYY-MM-DD');
                    canSelsArr.indexOf(fmtDate) === -1 && canSelsArr.push(fmtDate);
                    tem = dateExtend.add(tem, 1);
                }

                // 删除当前值
                canSelsArr.splice(i, 1);
            });

            this.canBeSelected = canSelsArr;
        },

        /**
         * 绑定选择事件
         * @return {[type]} [description]
         */
        _bindEvent: function() {
            var _this = this,
            	_Ele = $('.'+this.settings.el),
            	_isNeedSubmit =this.settings.isNeedSubmit,
            	_isNeedSubmitName =$('#'+this.settings.isNeedSubmitName),
            	_hideEl = $('.'+this.settings.hideEl),
            	_ShowDateEle = $('.'+this.settings.showDateEle),
            	_saveDateEle = $('#'+this.settings.saveDateEle),
            	_showReachDateEle = $('.'+this.settings.showReachDateEle),
            	_saveReachDateEle = $('#'+this.settings.saveReachDateEle),
            	_isNeedHideHeader = this.settings.isNeedHideHeader,
            	
            	el = $(this.settings.el),
                type = this.settings.type,
                dateArea = parseInt(this.settings.dateArea, 10),
            	tds = $('.'+this.settings.el).find("td");
            //console.log(tds);
            // 当天往返
            _this.daytoday = false;

            tds.off('click').on('click', function(e, flag) {
                var node = $(this).closest('td'),
                    date = node.attr('data-date'),
                    type = _this.settings.type;

                if(node.hasClass('disabled')) {
                    return;
                }
                if(date === null) {
                    return;
                }
                // 去除selected属性
                // 单个日历选择
                if(type == 'single') {
                    // 去掉提示语
                	_Ele.find('.selected').find('em.tip').remove();
                	_Ele.find('.selected').removeClass('selected');
                    _this.daytoday = false;
                // 选择往返日历
                } else if(type == 'multiple') {
                	//获取当前点击的是去程还是返程 go/back
                	_multipleType = $(".headerWeek").attr("data-multipleType");
                    // 比较两个选中的日期
                    var selected = _this._getSelectedDate();
                    //console.log(selected);
                    var days = dateExtend.compare(date, selected)/24/60/60/1000;
                    //重复选择去程，清除之前的提示
                    if(_multipleType=="go" && selected.length == 1){
                    	_Ele.find('.selected').find('em.tip').remove();
                    	_Ele.find('.selected').removeClass('selected');
                        _this.daytoday = false;
                        if($('.goback').length>0){
                        	$('.goback').remove();
                        }
                    }
                    // 最多可选择多少天
                    if(selected.length >= 2 || (selected.length == 1 && (days >= dateArea || days < 0))) {
                        // 去掉提示语
                    	if(_multipleType=="go"){
                        	_Ele.find('.selected').find('em.tip').remove();
                        	_Ele.find('.selected').removeClass('selected');
                            _this.daytoday = false;
                            //单独处理往返状态，重复选择去程
                            if($('.goback').length>0){
                                //alert("存在往返状态");
                                $('.goback').next().next().show();
                                $('.goback').next().remove();
                                $('.goback').remove();
                            }
                            //如果重复选择同一天的去程日期，直接不操作
                            // console.log($(node).children('.goTip'));
                            // if($(node).children('.goTip')){
                            //     return false;
                            // }
                    	}
                    	
                    //重复选择返程日期处理
                    	if($('.goTip').length >= 1 && _multipleType=="back"){
                            //alert("找到了！");
                    		//判断已选择去程日期和当前选择的日期比较
                    		if(Date.parse(new Date($('.goTip').parent().parent().attr("data-date")))<Date.parse(new Date($(node).attr("data-date")))){
                    			//清除之前的返程日期样式
                    			
                    			$('.backTip').parent().parent().removeClass("selected");
                    			//console.log($('.backTip').parent().parent());
                    			for(var i=0;i<$(".selected").length;i++){
                    				if(!$(".selected").find('.gotip')){
                    					$(".selected").children().eq(1).show();
                    					$(".selected").children().eq(0).remove();
                    				}
                    					$(".goback").next().show();
                    					$(".goback").remove();

                    			}
                    			//$('.tip').eq(1).next().show();
                    			//$('.tip').eq(1).remove();
                    			//
                    			$(".today>p").css("background","#c9c9c9");
                    			$(node).addClass('selected'); 
                            	$(node).children("p").hide();
                            	//$(node).children("p").before('<p class="bottom-center tip special">返</p>');
                    			//return;
                            	
                    		}
                    		//console.log($(node).attr("data-date"));
                    		//console.log(selected);
                        	//showMes("请选择去程（含去程当天）之后的某一天！");
                    	}
                    	
                    // 支持当天往返
                    } else if(selected.length == 1 && days == 0) {
                    	_Ele.find('.selected').find('em.tip').remove();
                        _this.daytoday = !_this.daytoday;
                    }
                }
                
                _Ele.find('.beselected').removeClass('beselected');
                //是否需要显示默认的Header
                if(_isNeedHideHeader){
                	$(".CommonHeader").show();
                	$(".fillingWrap").show(); 
                }
              _hideEl.show();
              _Ele.hide();

                // 增加selected属性
                $(this).addClass('selected');               


        		//存储价格日历数据
                //单程
                if(type == 'single') {
                    _ShowDateEle.text($(node).attr("data-date"));
                    _saveDateEle.val($(node).attr("data-date"));
                    if(_isNeedSubmit){
                        $("#takeoffdate1").val($(node).attr("data-date"));
                    }

                        	
                } else if(type == 'multiple') {
                //往返去程
                    if($('.headerWeek').attr("data-multipletype")=="go"){
                        _ShowDateEle.text($(node).attr("data-date"));
                        _saveDateEle.val($(node).attr("data-date"));
                         var nextDate = getNextDay($(node).attr("data-date"));
                        _showReachDateEle.text(nextDate); 
                        _saveReachDateEle.val(nextDate);
                    }else if($('.headerWeek').attr("data-multipletype")=="back"){
                //往返返程
                        _showReachDateEle.text($(node).attr("data-date"));
                        _saveReachDateEle.val($(node).attr("data-date"));
                        console.log($(node).attr(_saveReachDateEle));
                        //判断是否存在往返标识
                        if($('.goback').length>0){
                            //alert("存在往返状态");
                            $('.goback').next().show();
                            $('.goback').remove();
                        }
                	}
                }
                //判断：选择完日期后，是否需要执行提交表单。例：航班列表价格日历
                if(_isNeedSubmit){
                    loading();
                    _isNeedSubmitName.submit();
                }

                var beSelected = _this._getSelectedDate();
                // 设置返程日期
                if(type == 'multiple' && beSelected.length == 2) {
                    var arr = [];
                    var min = beSelected[0],
                        max = beSelected[1];
                    var tem = new Date(min);
                    while(dateExtend.compare(tem, max) < 0) {
                        tem = dateExtend.add(tem, 1);
                        var fmtDate = dateExtend.format(tem, 'YYYY-MM-DD');
                        arr.push(fmtDate);
                    }
                    
                    //arr.forEach(function(item) {
                    	//$(".showDateWarp").find('[data-date="'+item+'"]').not('.disabled').not('.selected').addClass('beselected');
                    //});
                }
                // 选择后对该节点居中显示内容(去/返/往返)
                var bc = _this.settings.bottom_center;
                if(bc && typeof bc == 'function') {
                    bc = bc.call(_this, e);
                }
                if(_this.settings.type=="multiple"){
                	//$(node).children("p").html(bc ? '<p class="bottom-center tip special">'+bc+'</p>' : '');
                	
                	//不选择去程直接选择返程
                	if($('.goTip').length == 0 && _multipleType=="back"){
                		//console.log($(".selected").length);
            			for(var i=0;i<$(".selected").length;i++){
            				//console.log($(".selected").eq(i).children().eq(0).innerText);
            				if($(".selected").eq(i).children('p').attr('class') && $(".selected").eq(i).children('p').attr('class').indexOf('backtips')!=-1){
                					$(".selected").eq(i).children().eq(1).show();
                					$(".selected").eq(i).children().eq(0).remove();
                					$(".selected").eq(i).removeClass('selected');
            				}
            			}
        				$(node).addClass("selected");
        				$(node).children("p").eq(0).before('<p class="bottom-center tip special backtips"><span class="backTip">返</span></p>');
        				$(node).children("p").eq(1).hide();	
                	}else{
	                	if(bc!="返"){
	                    	$(".backTip").parent().next().show();
	                    	$(".backTip").parent().remove();
	                    	if($('.headerWeek').attr("data-multipletype")=='go'){
	                        	$(".goTip").parent().next().show();
	                        	$(".goTip").parent().remove();
	                    	}
	                	}
	                	$(".today>p").css("background","#c9c9c9");
	                	$(node).children("p").hide();
	                	$(node).children("p").before(bc ? '<p class="bottom-center tip special">'+bc+'</p>' : '');
	                	}
                	//设置往返
                	//alert($('.goTip').length);
                	if($('.goTip') != 'undefined' && _multipleType=="back"){
                		var compareRes = Date.parse(new Date($('.goTip').parent().parent().attr("data-date"))) === Date.parse(new Date($(node).attr("data-date")));
                		if(compareRes){
                			$(".selected").removeClass("selected");
                			$(node).find(".backTip").parent().remove();
                			$(node).addClass("selected");
                        	$(".today>p").css("background","#c9c9c9");
                        	$(node).children("p").hide();
                        	$(node).children("p").eq(0).before('<p class="bottom-center tip special goback">'+"往返"+'</p>');
                		}
                		
                	}
            	}else{
                	$(node).append(bc ? '<p class="bottom-center tip special">'+bc+'</p>' : '');
                }

                // 回调函数
                var type = _this.settings.type;
                if(_this.daytoday || ((type == 'single' && _this._getSelectedDate().length == 1) || (type == 'multiple' && _this._getSelectedDate().length == 2)) && !flag) {
                    var callback = _this.settings.callback;
                    if(callback && typeof callback == 'function') {
                        callback.call(_this, e);
                    }
                } 
                // if(!flag) {
                //     var callback = _this.settings.callback;
                //     if(callback && typeof callback == 'function') {
                //         callback.call(_this, e);
                //     }
                // }
                
                //点击完，页面返回顶部
                document.getElementsByTagName('body')[0].scrollTop=0;
            });
        },
        /**
         * 获取被选中的日期
         * @return {[type]} [description]
         */
        _getSelectedDate: function() {
        	
            // 获取被选中的节点
        	var el = $('.'+this.settings.el);
               	selNodes = el.find('.selected');

            var arr = [];
            selNodes.each(function(i, item) {
                arr.push($(item).attr('data-date'));
            });
            
            if(this.daytoday && arr.length == 1) {
                arr.push(arr[0]);
            }

            return arr;
        },
        /**
         * 外部方法，获取已选中的日期
         * @return {[type]} [description]
         */
        getSelectedDate: function() {
            var type = this.settings.type,
                dates = this._getSelectedDate();

            // if(type == 'single') {
            //     return dates[0];
            // } else {
            //     return dates;
            // }
            return dates;
        },
        /**
         * 外部方法，设置已选中日期，以','分割
         */
        setSelectedDate: function(dates) {
            var type = this.settings.type,
                el = $(this.settings.el);

            var datesArr = dates.split(',');

            if(type === 'single') {
                datesArr = datesArr.splice(0, 1);
            } else if(type === 'multiple') {
                datesArr = datesArr.splice(0, 2);
            }
            if(datesArr[0] == datesArr[1]){
                datesArr.pop();
            }
            datesArr.forEach(function(item, i) {
                el.find('[data-date="'+item+'"]').trigger('click', 'set');
            });

            return this;
        },
        /**
         * 价格日历
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        // load: function(data) {
        // 	if(this.settings.isDynamic || this.settings.isOrderQuery){
        // 		return false;
        // 	}
        //     	var data = dateExtend.getPriceData(this.settings.priceUrl,this.settings.priceOrgCity,this.settings.priceDstCity,this.settings.priceOrgDate);
        //         var el = $(this.settings.el);
        //         if(!data) {
        //             return;
        //         }
        //         $.each(data, function(item, i){
        //             //console.log(item+"-->"+i);
        //             if(!$('td[data-date="'+item+'"]', el).hasClass('disabled')) {
        //                 $('td[data-date="'+item+'"]', el).find('.bottom-center').remove();
        //                 $('td[data-date="'+item+'"]').append('<span class="bottom-center price '+(i ? 'special' : '')+'">'+i+'</span>');
        //             }
        //         })
                
                //移除今天之前的价格日历
                	
//                 for(var m=0;m<=$('td').length;m++){
//                	 if(m<dateExtend.getTodayIndex()){
//                		 console.log($('td').eq(m));
//                	 }
//                 }
        

        //},
        removeDOM: function(className) {
            var el = $(this.settings.el);

            $(className, el).remove();
        }
    };
