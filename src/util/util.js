export default {
  /**
   * 转换时间格式
   * @param theDate
   * @returns {string}
   */
  formatDateTime: function (theDate) {
    var _hour = theDate.getHours();
    var _minute = theDate.getMinutes();
    var _second = theDate.getSeconds();
    var _year = theDate.getFullYear();
    var _month = theDate.getMonth();
    var _date = theDate.getDate();
    if (_hour < 10) {
      _hour = "0" + _hour;
    }
    if (_minute < 10) {
      _minute = "0" + _minute;
    }
    if (_second < 10) {
      _second = "0" + _second;
    }
    _month = _month + 1;
    if (_month < 10) {
      _month = "0" + _month;
    }
    if (_date < 10) {
      _date = "0" + _date;
    }
    return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
  },

  /**
   * 转换时间格式
   * @param theDate
   * @returns {string}
   */
  transDate2MMHHMM: function (theDate) {
    var _hour = theDate.getHours();
    var _minute = theDate.getMinutes();
    var _second = theDate.getSeconds();
    var _year = theDate.getFullYear();
    var _month = theDate.getMonth();
    var _date = theDate.getDate();
    if (_hour < 10) {
      _hour = "0" + _hour;
    }
    if (_minute < 10) {
      _minute = "0" + _minute;
    }
    if (_second < 10) {
      _second = "0" + _second;
    }
    _month = _month + 1;
    if (_month < 10) {
      _month = "0" + _month;
    }
    if (_date < 10) {
      _date = "0" + _date;
    }
    return _month + "-" + _date + " " + _hour + ":00";
  },


}
