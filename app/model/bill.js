"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL, BOOLEAN } = app.Sequelize;

  const Bill = app.model.define(
    "bill",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      card_id: INTEGER,
      code: STRING(30),
      startDate: DATE,
      endDate: DATE,
      // 账单日
      billDate: DATE,
      // 还款日
      repayDate: DATE,
      // 应还款金额
      amount: DECIMAL(10, 2),
      // 实际已还款金额
      incomeAmount: DECIMAL(10, 2),
      created_at: DATE,
      updated_at: DATE
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "bills",
      underscored: false
    }
  );

  Bill.associate = function() {
    app.model.Bill.belongsTo(app.model.Card, {
      foreignKey: "card_id",
      targetKey: "id"
    });
    app.model.Bill.hasMany(app.model.Flow, {
      foreignKey: "bill_id",
      targetKey: "id"
    });
  };

  return Bill;
};
