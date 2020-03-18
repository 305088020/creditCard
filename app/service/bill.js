"use strict";

const Service = require("egg").Service;
const dateFns = require("date-fns");

class Bill extends Service {
  async create(bill) {
    const ctx = this.ctx;
    return ctx.model.Bill.create(bill);
  }

  async update(id, updates) {
    const ctx = this.ctx;
    const bill = await ctx.model.Bill.findByPk(id);
    if (!bill) {
      ctx.throw(404, "该数据不存在");
    }
    return bill.update(updates);
  }

  /**
   * 默认更新所有card的本月账单
   * @param {card}} card_id
   */
  async updateAllBillByCurrent() {
    const ctx = this.ctx;
    const cards = await ctx.model.Card.findAll();
    cards.forEach(async card => {
      await this.updateBillByCard(card);
    });
  }

  /**
   * 默认更新所有card的本月账单
   * @param {card}} card_id
   */
  async updateBillByCardCurrent(card_id) {
    const ctx = this.ctx;
    const card = await ctx.model.Card.findByPk(card_id);
    return await this.updateBillByCard(card);
  }

  /**
   * 默认更新card的本月账单
   * @param {card}} card_id
   */
  async updateBillByCard(card) {
    const ctx = this.ctx;
    let bill_month = dateFns.format(new Date(), "yyyy-MM");
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();
    // 如果当天日期 < 这月账单日，应该取上月的账单
    // 如果今天日期 > 这月账单日，应该取这月的账单
    if (parseInt(day) > parseInt(card)) {
      bill_month = dateFns.format(new Date(year, month - 1, day), "yyyy-MM");
    }
    return this.updateBill(card.id, bill_month);
  }

  /**
   *
   * @param {*} card_id 银行卡
   * @param {*} bill_date 账单月份
   */
  async updateBill(card_id, bill_date) {
    const ctx = this.ctx;
    const card = await ctx.model.Card.findByPk(card_id);
    const { startDate, endDate, billDate, repayDate } = this.getStartAndEndDate(
      bill_date,
      card.billing_day,
      card.repayment_day
    );
    const code = String(card_id) + "-" + String(bill_date);
    // 新账单信息
    const bill = {
      card_id: card_id,
      code: code,
      startDate: startDate,
      endDate: endDate,
      billDate: billDate,
      repayDate: repayDate,
      amount: await this.getAmount(card_id, startDate, endDate),
      incomeAmount: await this.getIncomeAmount(card_id, startDate, endDate),
      created_at: new Date()
    };
    ctx.model.Bill.findOrCreate({
      where: {
        card_id: card_id,
        code: code
      },
      defaults: bill
    }).then(async ([user, created]) => {
      if (!created) {
        delete bill.created_at;
        bill.updated_at = new Date();
        await user.update(bill);
      }
      // 消费流水挂靠账单
      // await this.updateFlowBill(user.id, card_id, startDate, endDate);
      return user;
    });

    // // 查询有无账单信息
    // const bill_temp = await ctx.model.Bill.findOne({
    //   where: {
    //     card_id: card_id,
    //     code: code
    //   }
    // });
    // // 更新账单前，应该将相对应的流水都挂靠一下
    // // TODO

    // if (bill_temp) {
    //   bill.updated_at = new Date();
    //   const updateBill = await this.update(bill_temp.id, bill);
    //   this.updateFlowBill(updateBill.id, card_id, startDate, endDate);
    //   return updateBill;
    // } else {
    //   bill.created_at = new Date();
    //   const createBill = await this.create(bill);
    //   this.updateFlowBill(createBill.id, card_id, startDate, endDate);
    //   return bill;
    // }
  }

  async updateFlowBill(bill_id, card_id, startDate, endDate) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    return ctx.model.Flow.update(
      { bill_id: bill_id } /* set attributes' value */,
      {
        where: {
          card_id: card_id,
          direction: "-",
          tradeTime: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        }
      }
    );
  }
  /**
   * card_id,tradeTime 介于 startDate,endDate之间，消费的
   * @param {*} card_id
   * @param {*} startDate
   * @param {*} endDate
   */
  async getAmount(card_id, startDate, endDate) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const amount = await ctx.model.Flow.sum("amount", {
      where: {
        card_id: card_id,
        direction: "-",
        tradeTime: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      }
    });
    return amount;
  }
  /**
   * card_id,tradeTime 介于 startDate,endDate之间，还款的
   * @param {*} card_id
   * @param {*} startDate
   * @param {*} endDate
   */
  async getIncomeAmount(card_id, startDate, endDate) {
    // card_id,tradeTime 介于 startDate,endDate之间，还款的
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const incomeAmount = await ctx.model.Flow.sum("amount", {
      where: {
        card_id: card_id,
        direction: "+",
        tradeTime: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      }
    });
    return incomeAmount;
  }

  // 得到指定月份的账单日期，和相对应的还款日期，起止日期
  getStartAndEndDate(srcDate, bilDay, repayDay) {
    const year = srcDate.split("-")[0];
    const month = srcDate.split("-")[1] - 1;

    return {
      startDate: dateFns.format(
        new Date(year, month - 1, bilDay),
        "yyyy-MM-dd"
      ),
      endDate: dateFns.format(new Date(year, month, bilDay), "yyyy-MM-dd"),
      billDate: dateFns.format(new Date(year, month, bilDay), "yyyy-MM-dd"),
      repayDate: dateFns.format(
        parseInt(bilDay) > parseInt(repayDay)
          ? new Date(year, month + 1, repayDay)
          : new Date(year, month, repayDay),
        "yyyy-MM-dd"
      )
    };
  }
}

module.exports = Bill;
