"use strict";

const Service = require("egg").Service;
const dateFns = require("date-fns");

class Flow extends Service {
  /**
   * 消费
   * 1、新增消费流水
   * 2、可用额度减少
   * 3、如果消费日期期间已经产生账单，将当前消费纳入对应账单中,更新账单
   * 4、否则属于未出账单处理
   */
  /**
   * 还款
   * 1、新增还款流水
   * 2、可用额度增加
   * 3、如果已出账单，则更新账单
   * 4、否则不做处理
   */
  async create(flow) {
    const ctx = this.ctx;
    const direction = flow.direction;
    const card_id = flow.card_id;
    const card = await ctx.model.Card.findByPk(card_id);
    if (direction === "-") {
      card.amount = ctx.helper.formatNum(
        Number(card.amount) - Number(flow.amount),
        2
      );
      flow.outgoingAmount = flow.amount;
      flow.bill_id = await this.getBillId(flow, card);
    } else {
      card.amount = ctx.helper.formatNum(
        Number(card.amount) + Number(flow.amount),
        2
      );
      flow.incomeAmount = flow.amount;
    }
    flow.created_at = new Date();
    // 更新 card
    await card.save();
    const result = await ctx.model.Flow.create(flow);
    // 更新账单
    // 如果刷卡日期大于账单日的话，就更新下月账单，
    // 如果刷卡日期小于账单日的话，就更新这月账单，
    const tradeDay = dateFns.getDate(new Date(flow.tradeTime));
    let bill_month = dateFns.format(new Date(flow.tradeTime), "yyyy-MM");
    if (parseInt(tradeDay) >= parseInt(card.billing_day)) {
      bill_month = dateFns.format(
        dateFns.addMonths(new Date(flow.tradeTime), 1),
        "yyyy-MM"
      );
    }
    await ctx.service.bill.updateBill(card_id, bill_month);

    return result;
  }

  async del(id) {
    const ctx = this.ctx;
    const flow = await ctx.model.Flow.findByPk(id);
    if (!flow) {
      ctx.throw(404, "该记录不存在！");
    }
    const card_id = flow.card_id;
    const direction = flow.direction;
    const card = await ctx.model.Card.findByPk(card_id);
    if (direction === "+") {
      card.amount = ctx.helper.formatNum(
        Number(card.amount) - Number(flow.amount),
        2
      );
    } else if (direction === "-") {
      card.amount = ctx.helper.formatNum(
        Number(card.amount) + Number(flow.amount),
        2
      );
    }
    await card.save();
    // 更新账单
    ctx.service.bill.update();
    return flow.destroy();
  }
  //
  async getBillId(flow, card) {
    // 如果产生账单，交易日期 小于 在账单日
    const ctx = this.ctx;
    const billMonth = dateFns.format(new Date(flow.tradeTime), "yyyy-MM");
    const day = new Date(flow.tradeTime).getDate();
    if (parseInt(day) < parseInt(card.billing_day)) {
      const code = card.id + "-" + billMonth;
      const bill = await ctx.model.Bill.findOne({
        where: {
          card_id: card.id,
          code: code
        }
      });
      return (bill && bill.id) || null;
    }
  }
}

module.exports = Flow;
