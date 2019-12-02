"use strict";

const Service = require("egg").Service;

class Record extends Service {
  async create(record) {
    /** 新增的时候：
     *  1、如果 未还清，则银行卡额度 - 刷卡额度
     *
     *  2、如果 已还清，银行卡额度不变
     */

    const ctx = this.ctx;
    const is_flag = record.is_flag;
    const card_id = record.card_id;
    const record_amount = record.record_amount;

    if (!record.is_flag) {
      // 如果 未还清，则银行卡额度 - 刷卡额度
      const card = await ctx.model.Card.findByPk(card_id);
      if (card.amount < record_amount) {
        ctx.throw(500, "额度不够");
      }
      card.amount = card.amount - record_amount;
      await card.save();
    }
    return ctx.model.Record.create(record);
  }

  async update({ id, updates }) {
    const ctx = this.ctx;
    const record = await ctx.model.Record.findByPk(id);
    if (!record) {
      ctx.throw(404, "该数据不存在");
    }

    /**
     * 旧卡
     * 1、已还清，不管
     * 2、未还清，旧卡额度 + 旧卡刷卡额度
     *
     * */

    if (!record.is_flag) {
      const card = await ctx.model.Card.findByPk(record.card_id);
      card.amount = this.formatNum(
        Number(card.amount) + Number(record.record_amount),
        2
      );
      if (card.amount > card.quota) {
        card.amount = card.quota;
      }
      await card.save();
    }

    /**
     * 新卡
     * 1、已还清，不管
     * 2、未还清，新卡额度 - 新卡刷卡额度
     *
     * */
    if (!updates.is_flag) {
      const card = await ctx.model.Card.findByPk(updates.card_id);
      if (Number(updates.record_amount) > Number(card.amount)) {
        ctx.throw(500, "额度不够");
      }
      card.amount = this.formatNum(
        Number(card.amount) - Number(updates.record_amount),
        2
      );
      await card.save();
    }

    return record.update(updates);
  }

  async del(id) {
    const ctx = this.ctx;
    const record = await ctx.model.Record.findByPk(id);
    if (!record) {
      ctx.throw(404, "该记录不存在！");
    }
    // 如果这条记录已被还清，则不还原额度，否则还原额度
    const is_flag = record.is_flag;
    const card_id = record.card_id;
    if (!is_flag) {
      const card = await ctx.model.Card.findByPk(card_id);
      card.amount = this.formatNum(
        Number(card.amount) + Number(record.record_amount),
        2
      );
      if (card.amount > card.quota) {
        card.amount = card.quota;
      }
      console.log(card);
      await card.save();
    }
    return record.destroy();
  }

  formatNum(f, digit) {
    const m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
  }
}

module.exports = Record;
