"use strict";

const Service = require("egg").Service;

class Card extends Service {
  testDemo() {
    console.log("----------->就是这里");
  }
}

module.exports = Card;
