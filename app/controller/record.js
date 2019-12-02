"use strict";

const Controller = require("egg").Controller;

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class RecordsController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Record.findAll({
      include: [
        {
          model: ctx.model.Card,
          include: [{ model: ctx.model.Person }, { model: ctx.model.Bank }]
        }
      ]
    });
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Record.findByPk(ctx.params.id, {
      include: [
        {
          model: ctx.model.Card,
          include: [
            {
              model: ctx.model.Person
            },
            {
              model: ctx.model.Bank
            }
          ]
        }
      ]
    });
  }

  async create() {
    const ctx = this.ctx;
    const record = await ctx.service.record.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = record;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const body = ctx.request.body;
    ctx.body = await ctx.service.record.update({ id, updates: body });
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    await ctx.service.record.del(id);
    ctx.status = 200;
  }
}

module.exports = RecordsController;
