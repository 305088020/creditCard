"use strict";

const Controller = require("egg").Controller;

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class BanksController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Bank.findAll();
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Bank.findByPk(ctx.params.id);
  }

  // 新增
  async create() {
    const ctx = this.ctx;
    const { name } = ctx.request.body;
    const result = await ctx.model.Bank.create({
      name: name,
      created_at: new Date()
    });
    ctx.status = 201;
    ctx.body = result;
  }
  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const bank = await ctx.model.Bank.findByPk(id);
    if (!bank) {
      ctx.status = 404;
      return;
    }

    const { name } = ctx.request.body;
    await bank.update({
      name: name,
      updated_at: new Date()
    });
    ctx.body = bank;
  }
  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const bank = await ctx.model.Bank.findByPk(id);
    if (!bank) {
      ctx.status = 404;
      return;
    }

    await bank.destroy();
    ctx.status = 200;
  }
}

module.exports = BanksController;
