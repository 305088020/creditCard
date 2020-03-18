"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL, BOOLEAN } = app.Sequelize;

  const Flow = app.model.define(
    "flow",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      card_id: INTEGER,
      bill_id: INTEGER,
      // 出账
      outgoingAmount: DECIMAL(10, 2),
      // 入账
      incomeAmount: DECIMAL(10, 2),
      // 记账金额
      amount: DECIMAL(10, 2),
      // +还款 -消费
      direction: STRING,
      // 交易时间
      tradeTime: DATE,
      created_at: DATE,
      updated_at: DATE
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "flows",
      underscored: false
    }
  );

  Flow.associate = function() {
    app.model.Flow.belongsTo(app.model.Bill, {
      foreignKey: "bill_id",
      targetKey: "id"
    });
    app.model.Flow.belongsTo(app.model.Card, {
      foreignKey: "card_id",
      targetKey: "id"
    });
  };

  return Flow;
};
