"use strict";

const Controller = require("egg").Controller;
class FlowsController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Flow.findAll({
      include: [
        {
          model: ctx.model.Card,
          include: [{ model: ctx.model.Person }, { model: ctx.model.Bank }]
        }
      ]
    });
  }

  /**
   * 消费
   * 1、新增消费流水
   * 2、可用额度减少
   * 3、如果消费日期期间已经产生账单，将当前消费纳入对应账单中
   * 4、否则属于未出账单处理
   */

  /**
   * 还款
   * 1、新增还款流水
   * 2、可用额度增加
   * 3、如果已出账单，则更新账单
   * 4、否则不做处理
   */

  async create() {
    const ctx = this.ctx;
    const flow = await ctx.service.flow.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = flow;
  }

  /**
   * 删除流水
   * 1、如果是消费，则可用额度增加，更新相应的账单，没有账单不做处理
   * 2、如果是还款，则可用额度减少，更新相应的账单，没有账单不做处理
   * 3、删除流水
   */
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    await ctx.service.flow.del(id);
    ctx.status = 200;
  }
}
module.exports = FlowsController;
