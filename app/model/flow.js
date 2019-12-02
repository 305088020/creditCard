"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL, BOOLEAN } = app.Sequelize;

  const Flow = app.model.define(
    "flow",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      bill_id: INTEGER,
      // 出账
      outgoingAmount: DECIMAL,
      // 入账
      incomeAmount: DECIMAL,
      // 记账金额
      amount: DECIMAL,
      // +还款 -消费
      direction: STRING,
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
  };

  return Flow;
};
