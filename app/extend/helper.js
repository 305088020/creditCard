const dateFns = require("date-fns");

module.exports = {
  foo(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },
  toInt(str) {
    if (typeof str === "number") return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  },
  formatNum(f, digit) {
    const m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
  },
  // 得到刷卡后的账单日期，和最后还款日期
  getBillDate(recordDay, bilDay, repayDay) {
    /* 1.得到刷卡日期的日
     *  2.如果 record_day < bilDay 说明在账单日在这月，
     *  3.record_day > bilDay 说明账单日在下月，
     *  4.月份加上repayDay可得到最后还款日
     */
    const year = new Date(recordDay).getFullYear();
    const month = new Date(recordDay).getMonth();
    const day = new Date(recordDay).getDate();
    let finalDate = "";
    let billDate = "";
    if (parseInt(day) >= parseInt(bilDay)) {
      // 到下个月
      // 如果 bilDay > repayDay 就到下一月
      // 如果 bilDay < repayDay 就是这个月
      if (parseInt(bilDay) > parseInt(repayDay)) {
        finalDate = new Date(year, month + 2, repayDay);
      } else {
        finalDate = new Date(year, month + 1, repayDay);
      }
      billDate = new Date(year, month + 1, bilDay);
    } else if (parseInt(bilDay) > parseInt(repayDay)) {
      //
      finalDate = new Date(year, month + 1, repayDay);
    } else {
      finalDate = new Date(year, month, repayDay);
      billDate = new Date(year, month + 1, bilDay);
    }
    // 这个月
    // 如果 bilDay > repayDay 就到下一月
    // 如果 bilDay < repayDay 就是这个月
    return {
      billDate: dateFns.format(billDate, "yyyy-MM-dd"),
      lastDate: dateFns.format(finalDate, "yyyy-MM-dd")
    };
  },
  addDate(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var m = d.getMonth() + 1;
    return d.getFullYear() + "-" + m + "-" + d.getDate();
  },
  addMonth(date, months) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + months);
    var day = d.getDate();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day;
  }
  // formatTime(params, format = "YYYY-MM-DD HH:mm:ss") {
  //   return sd.format(new Date(params), format);
  // }
};
