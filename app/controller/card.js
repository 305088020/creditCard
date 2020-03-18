"use strict";

const Controller = require("egg").Controller;
const format = require("date-fns/format");
const subMonths = require("date-fns/subMonths");

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CardsController extends Controller {
  async index() {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const cards = await ctx.model.Card.findAll({
      include: [
        {
          model: ctx.model.Person
        },
        {
          model: ctx.model.Bank
        },
        {
          model: ctx.model.Record
        }
      ],
      order: [["person_id", "ASC"]]
    });
    for (let card of cards) {
      // 今天 < 账单日，上月账单
      // 今天 > 账单日，这月账单
      let today = new Date().getDate();
      let car_id = card.id;
      let bill_month = format(new Date(), "yyyy-MM");
      if (parseInt(today) <= parseInt(card.billing_day)) {
        bill_month = format(subMonths(new Date(), 1), "yyyy-MM");
      }
      let bill_code = car_id + "-" + bill_month;
      // 查询bill
      let bill = await ctx.model.Bill.findOne({
        where: {
          card_id: car_id,
          code: bill_code
        }
      });
      card.setDataValue("bill", bill);
    }

    ctx.body = cards;
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Card.findByPk(ctx.params.id, {
      include: [
        {
          model: ctx.model.Person
        },
        {
          model: ctx.model.Bank
        },
        {
          model: ctx.model.Record
        }
      ]
    });
  }
  // 新增
  async create() {
    const ctx = this.ctx;
    const post = await ctx.model.Card.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = post;
  }
  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const card = await ctx.model.Card.findByPk(id);
    if (!card) {
      ctx.status = 404;
      return;
    }
    const {
      person_id,
      bank_id,
      code,
      password,
      quota,
      amount,
      interest,
      billing_day,
      repayment_day
    } = ctx.request.body;

    await card.update({
      person_id,
      bank_id,
      code,
      password,
      quota,
      amount,
      interest,
      billing_day,
      repayment_day
    });
    ctx.body = card;
  }
  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const card = await ctx.model.Card.findByPk(id);
    if (!card) {
      ctx.status = 404;
      return;
    }

    await card.destroy();
    ctx.status = 200;
  }
}

module.exports = CardsController;
