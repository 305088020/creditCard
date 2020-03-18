"use strict";

const Controller = require("egg").Controller;

class BillsController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Bill.findAll({
      include: [
        {
          model: ctx.model.Card,
          include: [{ model: ctx.model.Person }, { model: ctx.model.Bank }]
        }
      ]
    });
  }

  /**
   * 生成账单
   * 根据card，账单日和流水，生成当前账单
   * papram (card_id, 月份)
   */
  async create() {
    const ctx = this.ctx;
    // const bill = await ctx.service.bill.createBill(25, "2019-12");
    const bill = await ctx.service.bill.updateBillByCardCurrent(25);
    ctx.status = 201;
    ctx.body = bill;
  }
  /**
   * 更新账单
   * 根据card，账单日和流水，更新当前账单，或者以往的账单
   * papram (card_id, 月份)
   */
  async update() {
    const ctx = this.ctx;
    const id = ctx.helper.toInt(ctx.params.id);
    ctx.body = await ctx.service.bill.updateBillByCardCurrent(id);
  }

  /**
   * 更新账单
   * 根据card，账单日和流水，更新当前账单，或者以往的账单
   * papram (card_id, 月份)
   */
  async updateAll() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.bill.updateAllBillByCurrent();
  }
}
module.exports = BillsController;
