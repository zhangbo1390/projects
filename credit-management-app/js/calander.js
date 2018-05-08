/**
 * Created by XbZhang on 4/18/2018.
 */
define("calendar/calendar4.js", function(require,exports,module){var template = "<div class=\"calendar-container\">\r\n\t<div class=\"fixed-part-height js_calendar_fixheight\">\r\n\t\t<div class=\"fixed-part js_calendar_head\">\r\n\t\t\t<section>\r\n\t\t\t\t<div class=\"calendar-head\">\r\n\t\t\t\t\t<a class=\"icon-arrow-left l text-left c-fff js_calendar_close\"></a>\r\n\t\t\t\t\t选择日期\r\n\t\t\t\t\t<a class=\"r text-right c-fff js_calendar_today\">今天</a>\r\n\t\t\t\t</div>\r\n\t\t\t</section>\r\n\t\t\t<!--单程时去除 以下去程 返程section选项 fixed-part-height 高度为3.35rem-->\r\n\t\t\t<section class=\"nav-bar round-trip js_calendar_travel_type\">\r\n\t\t\t\t<ul class=\"nav-tab js_calendar_tab\">\r\n\t\t\t\t\t<li class=\"current\"><span id=\"one\">去程</span><span class=\"scale75\">/span></li>\r\n\t\t\t\t\t<li><span id=\"two\">返程</span><span class=\"scale75\"></span></li>\r\n\t\t\t\t</ul>\r\n\t\t\t</section>\r\n\t\t\t<section class=\"calendar-week\">\r\n\t\t\t\t<ul class=\"clearfix\">\r\n\t\t\t\t\t<li>日</li>\r\n\t\t\t\t\t<li>一</li>\r\n\t\t\t\t\t<li>二</li>\r\n\t\t\t\t\t<li>三</li>\r\n\t\t\t\t\t<li>四</li>\r\n\t\t\t\t\t<li>五</li>\r\n\t\t\t\t\t<li>六</li>\r\n\t\t\t\t</ul>\r\n\t\t\t</section>\r\n\t\t</div>\r\n\t</div>\r\n\t<section class=\"js_calendar_date_content\">\r\n\r\n\t</section>\r\n</div>",
    monthTpl = "<div class=\"calendar-date\">\n    <p class=\"month\"><%=year%>年<%=_.filled(month+1)%>月</p>\n    <div class=\"date\">\n        <ul class=\"clearfix\">\n        <% for (var i=0; i<rowCount; i++) { %>\n        <% for(var j=0; j<7; j++) { var index = i * 7 + j %>\n           \n            <% if (index >= firstDay && index < firstDay + dayLength && list[index-firstDay]) { %> \n                <% var t = list[index-firstDay]; if (t) { %>\n                <li class=\"<%=((t.holiday || t.day1) ? 'festival' : '')%>\" date=\"<%=t.val%>\">\n\n                    <%=(t.holiday || t.day1 || parseInt(t.day))%>\n                    <% if (t.isRestDay) { %><span class=\"rest scale55\">休</span><% } %>\n                </li>\n            <% }} else { %>\n                <li></li>\n            <%}%>\n            \n        <% }} %>\n            <!--\n            <li class=\"disable\"></li>\n            <li class=\"disable festival\">国庆节</li>\n            <li>今天</li>\n            <li class=\"selected\">12</li>\n            <li class=\"festival\">清明节</li>-->\n            \n        </ul>\n    </div>\n</div>",
    view = $(template),
    map = {
        'js_depart': 0,
        'js_arrive': 1
    },
    tab = view.find('.js_calendar_tab li'),
    cdir = 'js_depart',
    option = {},
    dateMap = {},
    DATENAME = {
        'weeks': ['日', "一", '二', '三', '四', '五', '六'],
        'today': '今天',
        "yuandan": "元旦",
        "chuxi": "除夕",
        "chunjie": "春节",
        "yuanxiao": "元宵节",
        "qingming": "清明",
        "wuyi": "劳动节",
        "duanwu": "端午节",
        "zhongqiu": "中秋节",
        "guoqing": "国庆节"
    },
    HOLIDAYS = {
        yuandan: ["2015-01-01", "2016-01-01", "2017-01-01", "2018-01-01", "2019-01-01", "2020-01-01"],
        chuxi: ["2015-02-18", "2016-02-07", "2017-01-27", "2018-02-15", "2019-02-04", "2020-01-24"],
        chunjie: ["2015-02-19", "2016-02-08", "2017-01-28", "2018-02-16", "2019-02-05", "2020-01-25"],
        yuanxiao: ["2015-03-05", "2016-02-22", "2017-02-11", "2018-03-02", "2019-02-19", "2020-02-8"],
        qingming: ["2015-04-05", "2016-04-04", "2017-04-04", "2018-04-05", "2019-04-05", "2020-04-04"],
        wuyi: ["2015-05-01", "2016-05-01", "2017-05-01", "2018-05-01", "2019-05-01", "2020-05-01"],
        duanwu: ["2015-06-20", "2016-06-09", "2017-05-30", "2018-06-18", "2019-06-07", "2020-06-25"],
        zhongqiu: ["2015-09-27", "2016-09-15", "2017-10-04", "2018-09-24", "2019-09-13", "2020-10-01"],
        guoqing: ["2015-10-01", "2016-10-01", "2017-10-01", "2018-10-01", "2019-10-01", "2020-10-01"]
    },
    holidayList = require('holiday/list.js').list,
    selectDate1, selectDate2;


    function createDateMap(start, end) {
        dateMap = {};
        if (end < start) return;
        start = new start.constructor(start.valueOf());
        while(start <= end) {
            var year = start.getFullYear(),
                month = start.getMonth();
            if (!dateMap[year+_.filled(month+1)]) {
                dateMap[year+_.filled(month+1)] = {
                    year : year,
                    month : month,
                    monthStr : _.filled(month+1)
                }
            }
            start.setDate(start.getDate()+1);
        }
    }

    function renderMonth(year, month) {
        var date = new Date(),
            firstDay,
            dayLength = 31,
            rowCount,
            mview,
            html,
            start,
            end,
            detail,
            list = [],
            holiday,
            now = new Date();

        date.setFullYear(year, month, 1);
        firstDay = date.getDay();
        dayLength = _.DateTime.getCountDays(date, month);
        rowCount = Math.ceil((firstDay + dayLength) / 7);

        start = date;
        end = new start.constructor(start.valueOf());
        end.setMonth(end.getMonth()+1);
        end.setDate(0);
        while(start <= end) {
            detail = _.DateTime.getDetail(start);
            list.push(detail);
            holiday = getHolidays(_.DateTime.toString(start));
            if (holiday !== '') {
                holiday = DATENAME[holiday];
                detail.holiday = holiday;
            }
            detail.val = detail.year + '-' + detail.month + '-' + detail.day;
            if (start < now) {
                detail.before = true;
            }

            detail.isRestDay = isRestDay(_.DateTime.toString(start));

            start.setDate(start.getDate()+1);
        }

        html = _.template(monthTpl)({
            rowCount : rowCount,
            firstDay : firstDay,
            dayLength : dayLength,
            year : year,
            month : month,
            list : list
        });
        return html;
    }

    function selecthandler(v) {
        exports.trigger('select', v, cdir);
    }

    function render() {
        view.find('.js_calendar_date_content').empty();
        _.each(dateMap, function(elem) {
            var html = renderMonth(elem.year, elem.month);
            view.find('.js_calendar_date_content').append($(html));
        });
        view.find('.js_calendar_date_content li').on('touchstart', function(e) {
            if ($(e.currentTarget).hasClass('disable')) return;
            $(e.currentTarget).addClass('bg-touch');
        }).on('touchend', function(e) {
            if ($(e.currentTarget).hasClass('disable')) return;
            $(e.currentTarget).removeClass('bg-touch');
        }).click(function(e) {
            if ($(e.currentTarget).hasClass('disable')||($(e.currentTarget).attr("date")==null)) return;
            var date = $(e.currentTarget).attr('date');
//            selected = cdir === 'js_depart' ? selectDate1 : selectDate2;
//        if (_.DateTime.toString(selected) !== date) {
            selecthandler(date);
//        }
        });

    }

    function isRestDay(v) {
        var ret = _.find(holidayList, function(elem) {
            if (elem === v) return true;
        });
        if (ret)
            return true;
    }

    function getHolidays(v) {
        for (var property in HOLIDAYS) {
            var arr = HOLIDAYS[property];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == v) return property;
            }
        }
        return '';
    }

    function bindEvents() {
        tab.click(function(e) {
            if (option.unchange)
                return;
            tab.removeClass('current');
            $(e.currentTarget).addClass('current');
            cdir = $(e.currentTarget).index() === 0 ? 'js_depart' : 'js_arrive';
            setSelectUI();
        });

        view.find('.js_calendar_close').click(function(e) {
//        console.log('close')
            e.preventDefault();
            e.stopPropagation();
            close();
        });

        view.find('.js_calendar_today').click(function(e) {
//        console.log('today')
//        e.preventDefault();
//        e.stopPropagation();
//        $(document.body).scrollTop(0);
            var dtime = new Date();
            dtime = _.DateTime.toString(dtime);
            selecthandler(dtime);
        })
    }

    function setEnableDate(date, dir) {
        dir = dir || 1;

        _.map(view.find('.js_calendar_date_content li'), function(elem) {
            var str = $(elem).attr('date'),
                strDate;
            if (str) {
                strDate = _.DateTime.toDate(str);
                if (dir > 0) {
                    if (strDate < date)
                        $(elem).addClass('disable');
                } else {

                    if (strDate > date) {
                        $(elem).addClass('disable');
                    }

                }
            }
        });
    }

    function  setTabDate(date1, date2) {
        selectDate1 = date1;
        selectDate2 = date2;
        if (date1) {
            date1 = _.DateTime.getDetail(date1);
            tab.eq(0).find('span:last-child').html(date1.year + '-' + date1.month + '-' + date1.day + ' ' + (date1.day1 || date1.weekday));
        }
        if (date2) {
            date2 = _.DateTime.getDetail(date2);
            tab.eq(1).find('span:last-child').html(date2.year + '-' + date2.month + '-' + date2.day + ' ' + (date2.day1 || date2.weekday));
        }
    }

    function setSelectUI() {
        view.find('.js_calendar_date_content li').removeClass('disable');
        view.find('.js_calendar_date_content li.selected').removeClass('selected');
        var date = cdir === 'js_depart' ? selectDate1 : selectDate2;
        var node;
        if(date){
            node = findNode(_.DateTime.toString(date));
        }
        if (node && node.length > 0) {
            node.addClass('selected');
            var p = node.parent().parent().parent(),
                top = p.offset().top - view.find('.js_calendar_fixheight').height() - parseInt(p.css('margin-top'))

            $(document.body).scrollTop(top);

        }

        if (cdir === 'js_depart') {
            var now = new Date();

            setEnableDate(_.DateTime.toDate(_.DateTime.toString(now)));
        } else {
            now = selectDate1;
            setEnableDate(_.DateTime.toDate(_.DateTime.toString(now)));
        }
    }

    function findNode(v) {
        var ret = _.find(view.find('.js_calendar_date_content li'), function(elem) {
            if ($(elem).attr('date') === v)
                return true;
        });
        return $(ret);
    }

    function setTab(dir) {
        cdir = dir;
        tab.removeClass('current').eq(map[dir]).addClass('current');
    }

    function close() {
        view.remove();
        exports.off();
    }

    bindEvents();
    view.css({
        left: 0,
        top: 0
    });

    _.extend(exports, Events, {
        show: function(type, dir, opts) {
            type = type || 'OW';
            $(document.body).append(view);
            view.css('z-index', zIndex++);
            if (type === 'OW') {
                cdir = dir;
                view.find('.js_calendar_travel_type').hide();
            } else if (type === 'RT') {
                setTab(dir);
                view.find('.js_calendar_travel_type').show();
            }
            view.find('.js_calendar_fixheight').height(view.find('.js_calendar_head').height());
            _.extend(option, opts);
            if (!option.startDate) {
                var date = new Date();
                date.setDate(1);
                option.startDate = date;
            }
            if (!option.endDate || option.endDate <= option.startDate) {
                date = new date.constructor(option.startDate.valueOf())
                date.setMonth(date.getMonth()+13);
                date.setDate(0);
                option.endDate = date;
            }

            if(option.showTile!=null){
                $("#one").html(option.showTile[0]);
                $("#two").html(option.showTile[1]);
            }else{
                $("#one").html("去程");
                $("#two").html("返程");
            }

            createDateMap(option.startDate, option.endDate);
            render();
        },



        setDate : function(date1, date2) {
            setTabDate(date1, date2);
            setSelectUI();
        },

        setEnableDate : function(date, dir) {
            if (!_.DateTime.isDate(date)) {
                date = _.DateTime.toDate(date);
            }
            setEnableDate(date, dir);
        },

        hide: function() {
            close();
        }
    });});