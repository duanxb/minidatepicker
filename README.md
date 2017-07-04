# minidatepicker

预约时间上下午选择器插件



## 演示



![此处输入图片的描述][1]



## 参数
| 参数        	| 说明           |
| ------------- |-------------|
| lang          | 字符，中英文选择：cn/en，默认中文 |
| startDate       | 开始日期：格式：2017-01-01，默认当前日期 | 
| dateCycle       | 日期可选范围，默认为7天      | 
| maxSelectCount  | 最大选择日期个数，默认为7 | 
| minSelectCount  | 最少选择日期个数,默认为1   | 
| continuity      | 是否必须连续选择，默认false |
| selectDayArr    | 默认选中日期 Array [{datestr: "2017-07-15",am: true,pm: false},{……}，{……} |



## 回调

| 参数            | 说明          |
| -------------   |-------------|
| onBeforeClear   | 点击清除日期前执行,参数：selectDates，当前选中的日期数组 |
| onSelectDay | 点击选中后日期执行 参数：ele（点击的对象）, data（点击对象的日期）, msg （文案描述） |
| onConfirm | 点击确定按钮后执行 参数：dates 当前选中的日期数组 |



## 事件



$.datePickerPrototype.now() --> 返回当前日期：YYYY-MM-DD

$.datePickerPrototype.day(count,date) --> 日期计算：date为日期，日期+count天，返回一个新的日期

$.datePickerPrototype.month(count,date) --> 日期计算：date为日期，日期+count月，返回一个新的日期

$.datePickerPrototype.year(count,date) --> 日期计算：date为日期，日期+count年，返回一个新的日期

$.datePickerPrototype.dateDiff(date1,date2) --> 日期计算：两个日期之间相差几天

$.datePickerPrototype.getWeek(datestr) --> 计算日期是星期几





[1]: https://raw.githubusercontent.com/duanxb/minidatepicker/master/minidatepicket.gif =300x
