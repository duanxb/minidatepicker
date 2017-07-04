/* =========================================================
 * jquery-minidatepicker.js
 * =========================================================
 * Copyright 2017 XiBao Duan
 * ========================================================= */

 (function(factory){
    if (typeof define === 'function' && define.amd)
      define(['jquery'], factory);
    else if (typeof exports === 'object')
      factory(require('jquery'));
    else
      factory(jQuery);

}(function($, undefined){

	// mimiDatePicker构造器
	var MiniDatePicker = function (element, options) {

		if( element ){
			var $this = this;
			this.element = $(element);
			//options setting
			this.lang = options.lang || "cn";
			this.language = datepicklang[this.lang];
			this.startDate = options.startDate || this.now();
			this.dateCycle = options.dateCycle || 7;
			this.endDate = this.getEndDate();
			this.maxSelectCount = options.maxSelectCount || 5,
			this.minSelectCount = options.minSelectCount || 1,
			this.continuity = options.continuity || false,
			this.selectDayArr = options.selectDayArr || [];
			this.onBeforeClear = options.onBeforeClear || function() {},
			this.onSelectDay = options.onSelectDay || function() {};
			this.onConfirm = options.onConfirm || function() {};

			this.wrapper = $('<div class="miniDatepickerWrapper"></div>');
			this.create();

			this.element.on('click',function(){
				$this.showDatePicker();
			})
			
		}
	}
	/*
	* MiniDatePicker增加原型链
	*/ 
	MiniDatePicker.prototype = {
		// 生成日历
		create: function () {

			var $this = this;
			var months = this.getMonths();

			var weekdayArr = this.language.daysShort,
				ButtonArr  = this.language.button;

			var wrapperTop =  $('<div class="miniDatepickTop"></div>'),
				weekDayList = $('<div class="minidateweekdays"></div');

			var wrapperTopTitle =  $('<span><i class="iconfont icon-rili"></i>'+ this.dateCycle+this.language.day +'</span>');
			var wrapperTopButton = $('<span><i class="iconfont icon-clear"></i></span>');
				wrapperTopButton.on('click', function() {
					var beforeClear = $this.onBeforeClear($this.selectDayArr);
					if (beforeClear === false) {
						return beforeClear;
					}
					dateContainer.find(".active").removeClass("active");
					dateContainer.find("[data-active]").removeAttr("data-active");
					$this.selectDayArr = [];
				})

			wrapperTop.append(wrapperTopTitle).append(wrapperTopButton);

			var ulElement = $("<ul></ul>");

			weekdayArr.map(function (item) {

				var liElemnet = $("<li></li>");
				liElemnet.html(item);
				ulElement.append(liElemnet);

			})

			weekDayList.append(ulElement);

			var dateContainer = $('<div class="miniDatepickContent"></div>');

			months.map(function (item) {  

				var monthdays = $this.draw(item.year, item.month);
				dateContainer.append(monthdays);

			})

			var wrapperBottom = $('<div class="miniDatepickBottom"></div>');

			ButtonArr.map(function (item,index) {

				var ButtonElement = $('<button></button>');
					ButtonElement.prop('type','button').addClass('miniDateButton').html(item);

					ButtonElement.on('click', function() {
						if(index == $this.minSelectCount){
							if($this.selectDayArr.length == 0){
								alert("请至少选择"+ $this.minSelectCount +"预约时间");
								return false;
							}
							$this.onConfirm($this.selectDayArr);
						}
						$this.hideDatePicker();
					})
				
				wrapperBottom.append(ButtonElement);

			})

			this.wrapper.append(wrapperTop)
						.append(weekDayList)
						.append(dateContainer)
						.append(wrapperBottom);
			
			$("body").append(this.wrapper);
		     
		},
		// 获得起始日期之间的月份数组
		getMonths: function () {

			var result = [];
		    var starts = this.startDate.split('-');
		    var ends = this.endDate.split('-');
		    var staYear = parseInt(starts[0]);
		    var staMon = parseInt(starts[1]);
		    var endYear = parseInt(ends[0]);
		    var endMon = parseInt(ends[1]);
		    while (staYear <= endYear) {
		        if (staYear === endYear) {
		            while (staMon <= endMon) {
		                result.push({year: staYear, month: staMon});
		                staMon++;
		            }
		            staYear++;
		        } else {
		            if (staMon > 12) {
		                staMon = 1;
		                staYear++;
		            }
		            result.push({year: staYear, month: staMon}); 
		            staMon++;

		        }
		    }

		    return result;
		},
		// 绘制日历
		draw: function (iYear, iMonth) {

			var $this = this;

			var startDateInfo = this.getStartDateInfo();
			var firstDay = new Date(iYear, iMonth - 1, 1).getDay(),
				lastDay = new Date(iYear, iMonth, 0).getDate();

			//如果是开始日期为第一个月的
			if(startDateInfo.year == iYear && startDateInfo.month == iMonth){
				firstDay = startDateInfo.weekday;
			}

			var contentWrap = $('<div class="month_'+iMonth+'"></div>');
			var monthPlace = $('<div class="miniDateMonth"></div>');
			var iMonthText = '<span class="offset-'+firstDay+'">'+ $this.language.monthsShort[iMonth - 1] +'</span>';
				monthPlace.append(iMonthText);

			var ARR = [],
				oA,
				aValue,
				cur,
				ulElement = $('<ul></ul>');

			for (i = 1; i <= firstDay; i++) ARR.push(0);
			for (i = 1; i <= lastDay; i++) 	ARR.push(i);
			
			while(ARR.length) {

				for (i = 1, len = ARR.length; i <= len; i++) {

					if (ARR.length) {

						sValue = ARR.shift();

						if (!sValue) {

							var liElemnet = $('<li></li>');
								liElemnet.addClass('disabled');

							ulElement.append(liElemnet);

						} else {

							var _dataDate = iYear + "-" + this.format(iMonth) + "-" + this.format(sValue);
							var _weekday  = this.getWeek(_dataDate);

							if(_dataDate >= this.startDate && _dataDate <= this.endDate) {

								var liElemnet = $('<li></li>');
									liElemnet.attr('data-date',_dataDate).attr('data-week',_weekday);

								var _innerDay = $('<span class="mini_day">'+ sValue +'</span>'),
									_innerAm  = $('<span class="mini_am">'+ $this.language.meridiem[0] +'</span>'),
									_innerPm  = $('<span class="mini_pm">'+ $this.language.meridiem[1] +'</span>');

								if(this.selectDayArr.length > 0){

									$.each(this.selectDayArr, function (ind,item) {

										if(parseInt(item.datestr.replace(/-/g, "")) == parseInt(_dataDate.replace(/-/g, ""))){
											if(item.am == true){

												liElemnet.attr("data-active","true");
												_innerAm.addClass("active");

											}
											if(item.pm == true){

												liElemnet.attr("data-active","true");
												_innerPm.addClass("active");

											}
											if(item.am == true && item.pm == true){

												liElemnet.attr("data-active","true");
												_innerDay.addClass("active");

											}
										}
									})
								}

								this.onClickHandle(0, _innerDay);
								this.onClickHandle(1, _innerAm);
								this.onClickHandle(1, _innerPm);


								liElemnet.append(_innerDay)
										 .append(_innerAm)
										 .append(_innerPm);

								ulElement.append(liElemnet);

								cur = new Date(iYear, iMonth - 1, sValue);
							}
							
						}
					}
					
				}
		
			}

			contentWrap.append(monthPlace).append(ulElement);

			return contentWrap;
		},
		// 获取开始日期所在的年份、月份
		getStartDateInfo: function () {

			var currentDate = {};
			var _startDate = this.startDate;
			var _dateobj = new Date(_startDate);
			currentDate.year = _dateobj.getFullYear();
			currentDate.month = _dateobj.getMonth() + 1;
			currentDate.weekday = _dateobj.getDay();

			return currentDate;

		},
		// 获得日期的周几
		getWeek: function (datestr) {

			var arr = this.getTimeByTimeStr(datestr);
			return new Date(arr[0], arr[1] - 1, arr[2]).getDay();

		},
		//格式化数字, 不足两位补0
		format: function (str) {

			return str.toString().replace(/^(\d)$/, "0$1")

		},
		// 获得结束日期
		getEndDate: function () {

			if (!this.dateCycle){return false}
			return this.day(this.dateCycle,this.startDate);

		},
		// 获得当前日期函数
		newDate: function () {

			return new Date()

		}, 
		//解析 格式化的日期，返回数组
	    getTimeByTimeStr: function (dateString) { 

	        var ArrDate = dateString.split("-");
	        return ArrDate;

	    },
	    //当前获得日期: T
	    now : function () { 

	        var dd = this.newDate(); 
	        var y = dd.getFullYear();    
	        var m = dd.getMonth()+1;//获取当前月份的日期    
	        var d = dd.getDate();    

	        return y + "-" + (m < 10 ? ('0' + m) : m) + "-" + (d < 10 ? ('0' + d) : d);
	    },
	    //日期计算，D + n 天
	    day : function (n, dateString) {

	        var dd = this.newDate(); 
	        if(dateString){
	            dateString = this.getTimeByTimeStr(dateString);
	            dd = new Date( dateString[0],(dateString[1]-1), dateString[2] ); 
	        }
	            dd.setDate( dd.getDate() + n );//获取n天后的日期    
	        var y = dd.getFullYear();    
	        var m = dd.getMonth()+1;//获取当前月份的日期    
	        var d = dd.getDate();   
	      
	        return y + "-" + ( m < 10 ? ('0' + m ) : m ) + "-" + ( d < 10 ? ( '0' + d ) : d);
	    },
	    //日期计算： M + n 月
	    month: function (n, dateString){ 

	        var dd = this.newDate(); 
	        if( dateString ){
	            dateString = this.getTimeByTimeStr(dateString);
	            dd = new Date( dateString[0], (dateString[1] - 1), dateString[2]); 
	        }
	            dd.setMonth(dd.getMonth() + n);    
	        var y = dd.getFullYear();    
	        var m = dd.getMonth()+1;   
	        var d = dd.getDate();    

	        return y + "-" + ( m < 10 ? ('0' + m) : m) + "-" + ( d < 10 ? ( '0' + d ) : d);    
	    },
	    //日期计算： Y + n 年
	    year: function (n, dateString) { 

	        var d2= this.newDate(); 
	        if(dateString){
	            dateString = this.getTimeByTimeStr(dateString);
	            d2 = new Date(dateString[0],(dateString[1]-1),dateString[2]); 
	        }
	            d2.setFullYear(d2.getFullYear()+n);
	            
	        var y = d2.getFullYear();    
	        var m = d2.getMonth()+1;   
	        var d = d2.getDate();    

	        return y + "-" + ( m < 10 ? ('0' + m) : m) + "-" + (d < 10 ? ('0' + d) : d); 
	    },
	    dateDiff: function (sDate1,  sDate2){  

	       var aDate, oDate1, oDate2, iDays; 
	       aDate  =  this.getTimeByTimeStr(sDate1);
	       oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
	       aDate  =  this.getTimeByTimeStr(sDate2);
	       oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);  
	       iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24); 

	       return  iDays  
	   	},
	    // 绑定事件
	    onClickHandle: function (n, el) {

	    	var $this = this;

	    	el.on('click', function() {
	    		var ele = $(this), 
	    			$parent = ele.parent('li'), 
	    			isSelected = ele.hasClass('active'),
	    			amselect = ele.hasClass("mini_am"),
	    			pmselect = ele.hasClass("mini_pm"),
	    			curdate = $parent.attr("data-date");
	    		
	    		if(!$parent.attr('data-active')){

	    			var maxSelect = $this.maxSelected();
	    			if(maxSelect == false) return maxSelect;

	    		}
	    		if($this.selectDayArr.length > 0 && $this.continuity){

		    		if($this.isSelected(curdate) == false) {
		    			alert("不支持非连续性选择");
		    			return false;
		    		}

	    		}
	    		switch(n) {
		    		case 0:
						if(isSelected) {

							$parent.removeAttr('data-active').find('span').removeClass('active');

						}else{

							$parent.attr('data-active',true).find('span').addClass('active');
							var callData = {
												datestr: $parent.attr("data-date"),
												am: true,
												pm: true
											},
								msg = "选择了" + callData.datestr + "全天";

							$this.onSelectDay($parent, callData, msg);
						}
		    			break;
		    		case 1:
		    			if(isSelected) {

		    				if($parent.find(".active").length == 1){
		    					$parent.removeAttr('data-active');
		    				}
							ele.removeClass('active');

						}else{

							$parent.attr('data-active',true);
							ele.addClass('active');

							if(amselect){var meridiem = $this.language.meridiem[0]}
							if(pmselect){var meridiem = $this.language.meridiem[1]}

							var callData = {
												datestr: $parent.attr("data-date"),
												am: amselect,
												pm: pmselect
											},
								msg = "选择了" + callData.datestr + meridiem;

							$this.onSelectDay($parent, callData, msg);

						}
		    			break;
		    	}

		    	$this.storeSaveDate();
	    	})	
	    },
	    // 是否可选中
	    isSelected: function (curdate) {

	    	var $this = this,
	    		diff = 0;

	    	this.selectDayArr.forEach(function (item,index) {

	    		var clac = $this.dateDiff(item.datestr, curdate);
	    		if( clac == 1 || clac == 0){
	    			diff = 1;
	    			return true;
	    		}

	    	})

	    	if(diff == 1){
	    		return true;
	    	}
	    	return false;
	    	
	    },
	    maxSelected: function () { 

	    	if(this.selectDayArr.length == this.maxSelectCount) {
	    		alert("仅支持连续选择"+ this.maxSelectCount +"天");
	    		return false;
	    	}

	    	return true;
	    },
	    // 获取选中的日期存储
	    storeSaveDate: function () {

	    	var $this = this,
	    		selectedLi = $("li[data-active]");

	    	$this.selectDayArr = [];

	    	$.each(selectedLi, function(index,item) {

	    		var selectedobj = {datestr:"", am:false, pm:false};
	    		item = $(this);
	    		selectedobj.datestr = item.attr('data-date');
	    		if( item.find('span').eq(1).hasClass('active') ){
	    			selectedobj.am = true;
	    		}
	    		if( item.find('span').eq(2).hasClass('active') ){
	    			selectedobj.pm = true;
	    		}
	    		$this.selectDayArr.push(selectedobj);

	    	})
	    	

	    	
	    },
	    hideDatePicker: function () {

	    	this.wrapper.removeClass("fadeInRight");
	    	$("body").removeClass("openMiniDate");

	    },
	    showDatePicker: function () {

	    	this.wrapper.addClass("fadeInRight");
	    	$("body").addClass("openMiniDate");

	    }



	}

	$.fn.minidatepicker = function (option){

		var args = Array.apply(null, arguments);
	    args.shift();
	    var internal_return;
	    this.each(function () {

	      var $this = $(this),
	          data = $this.data('minidatepicker'),
	          options = typeof option === 'object' && option;

	      if (!data) {
	        $this.data('datetimepicker', (data = new MiniDatePicker(this, $.extend({}, $.fn.minidatepicker.defaults, options))));
	      }
	      if (typeof option === 'string' && typeof data[option] === 'function') {

	        internal_return = data[option].apply(data, args);
	        if (internal_return !== undefined) {
	          return false;
	        }
	      }
	    });
	    if (internal_return !== undefined)
	      return internal_return;
	    else
	      return this;

	}

	//返回一个MiniDatePicker原先链
	$.datePickerPrototype = new MiniDatePicker();

	//默认值参数设置
	$.fn.minidatepicker.defaults = {}

	//语言包
	var datepicklang = $.fn.minidatepicker.language = {
		en: {
			day: 'days',
		    days:        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		    daysShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		    daysMin:     ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		    months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		    meridiem:    ['am', 'pm'],
		    button: 		['cancel', 'confirm'],
	    },
	    cn: {
	    	day: '天',
	    	days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],  
	        daysShort:  ["日", "一", "二", "三", "四", "五", "六"],  
	        daysMin:    ["日", "一", "二", "三", "四", "五", "六"],  
	        months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
	        monthsShort:  ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],  
	        meridiem:    ["上午", "下午"],  
	        button: 	['取消', '确认'],
	    }
	}

}))