"use strict";

const Controller = require("egg").Controller;

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CardsController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Card.findAll({
      include: [
        {
          model: ctx.model.Person
        },
        {
          model: ctx.model.Bank
        },
        {
          model: ctx.model.Record
        },
        {
          model: ctx.model.Bill,
          include: [{ model: ctx.model.Flow }]
        }
      ]
    });
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
