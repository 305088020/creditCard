"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL } = app.Sequelize;

  const Card = app.model.define(
    "card",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      // 用户
      person_id: INTEGER,
      // 银行
      bank_id: INTEGER,
      // 卡号
      code: STRING(30),
      // 密码
      password: STRING(30),
      // 额定额度
      quota: DECIMAL(10, 2),
      // 可用额度
      amount: DECIMAL(10, 2),
      // 费率
      interest: DECIMAL(10, 2),
      // 账单日
      billing_day: INTEGER,
      // 还款日
      repayment_day: INTEGER,
      created_at: DATE,
      updated_at: DATE
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "cards",
      underscored: false
    }
  );

  Card.associate = function() {
    // 与人员表 多对一
    app.model.Card.belongsTo(app.model.Person, {
      foreignKey: "person_id",
      targetKey: "id"
    });
    // 与银行表 多对一
    app.model.Card.belongsTo(app.model.Bank, {
      foreignKey: "bank_id",
      targetKey: "id"
    });
    // 与记录表，一对多
    app.model.Card.hasMany(app.model.Record, {
      foreignKey: "card_id",
      targetKey: "id"
    });
    // 与账单表，一对多
    app.model.Card.hasMany(app.model.Bill, {
      foreignKey: "card_id",
      targetKey: "id"
    });
    // 与流水表，一对多
    app.model.Card.hasMany(app.model.Flow, {
      foreignKey: "card_id",
      targetKey: "id"
    });
  };

  Card.findByIdWithUser = async function(id, userId) {
    return await this.findOne({
      where: { id, person_id: userId }
    });
  };

  return Card;
};
