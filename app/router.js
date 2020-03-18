"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  // login
  router.post("/login", controller.login.login);
  router.post("/logout", controller.login.logout);
  router.post("/getInfo", controller.login.getInfo);
  router.resources("user", "/users", controller.users);
  router.resources("person", "/person", controller.person);
  router.resources("bank", "/bank", controller.bank);
  router.resources("card", "/card", controller.card);
  router.resources("record", "/record", controller.record);
  router.resources("bill", "/bill", controller.bill);
  router.resources("flow", "/flow", controller.flow);
  router.get("/updateAllBill", controller.bill.updateAll);
};
