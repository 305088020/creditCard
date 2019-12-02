"use strict";

const Controller = require("egg").Controller;

class LoginController extends Controller {
  async login() {
    const { ctx } = this;
    ctx.body = {
      data: {
        token: "1234567890"
      }
    };
  }
  async logout() {
    const { ctx } = this;
    ctx.body = {
      data: {
        success: true
      }
    };
  }
  async getInfo() {
    const { ctx } = this;
    ctx.body = {
      data: {
        token: "1234567890",
        username: "hezi",
        userId: "100",
        role: "admin",
        avatar: "",
        hasGetInfo: true
      }
    };
  }
}

module.exports = LoginController;
