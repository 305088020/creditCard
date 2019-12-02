/* eslint valid-jsdoc: "off" */

"use strict";

const path = require("path");
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    security: {
      csrf: {
        enable: false
      }
    }
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1569742595833_920";

  // add your middleware config here
  config.middleware = [];

  // 数据库配置文件
  config.sequelize = {
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "cpsa123456",
    port: 3306,
    database: "creditCard",
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    timezone: "+08:00" //改为标准时区
  };
  // config.sequelize = {
  //   dialect: 'sqlite',
  //   storage: '/Users/hezi/work/NodeJS/egg/creditCard/database/db.sqlite3',
  // };

  // config.js
  config.cors = {
    origin: "*",
    credentials: true,
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };
  // config.security.csrf = {
  //   enable: false
  // };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};
exports.swagger2 = {
  enable: false, // 禁用swagger , 默认为true
  base: {
    /* default config,support cover
    schemes: [
        'http',
    ],
    host: '127.0.0.1:7001',
    basePath: '/',
    consumes: [
    'application/json',
    ],
    produces: [
    'application/json',
    ],
    */
    info: {
      description: "This is a test swagger-ui html",
      version: "1.0.0",
      title: "TEST",
      contact: {
        email: "caandoll@aliyun.com"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    tags: [
      {
        name: "admin",
        description: "Admin desc"
      },
      {
        name: "role",
        description: "Role desc"
      }
    ],
    definitions: {
      // model definitions
    },
    securityDefinitions: {
      // security definitions
    }
  }
};
