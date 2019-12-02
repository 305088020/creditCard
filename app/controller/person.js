"use strict";

const Controller = require("egg").Controller;

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class PersonsController extends Controller {
  // 首页
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Person.findAll({
      include: {
        model: ctx.model.Card,
        include: [
          {
            model: ctx.model.Bank
          },
          {
            model: ctx.model.Record
          }
        ]
      }
    });
  }
  // 详情
  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Person.findByPk(ctx.params.id, {
      include: {
        model: ctx.model.Card,
        include: {
          model: ctx.model.Bank
        }
      }
    });
  }
  // 新增
  async create() {
    const ctx = this.ctx;
    const { name } = ctx.request.body;
    const person = await ctx.model.Person.create({
      name: name,
      created_at: new Date()
    });
    ctx.status = 201;
    ctx.body = person;
  }
  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const person = await ctx.model.Person.findByPk(id);
    if (!person) {
      ctx.status = 404;
      return;
    }

    const { name } = ctx.request.body;
    await person.update({
      name: name,
      updated_at: new Date()
    });
    ctx.body = person;
  }
  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const person = await ctx.model.Person.findByPk(id);
    if (!person) {
      ctx.status = 404;
      return;
    }

    await person.destroy();
    ctx.status = 200;
  }
}

module.exports = PersonsController;
