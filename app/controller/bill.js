"use strict";

const Controller = require("egg").Controller;

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class BillsController extends Controller {
  /**
   * 生成账单
   * 根据card，账单日和流水，生成当前账单
   * papram (card_id, 月份)
   */
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Bill.findAll();
  }
  /**
   * 更新账单
   * 根据card，账单日和流水，更新当前账单，或者以往的账单
   * papram (card_id, 月份)
   */
}
module.exports = BillsControllers;
