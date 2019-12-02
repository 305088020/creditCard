"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL, BOOLEAN } = app.Sequelize;

  const Record = app.model.define(
    "record",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      card_id: INTEGER,
      // 金额
      record_amount: DECIMAL(10, 2),
      // 手续费
      record_handling_fee: DECIMAL(10, 2),
      // 刷卡日期
      record_day: DATE,
      // 是否已还
      is_flag: BOOLEAN,
      // note
      note: STRING,
      // 最后还款日期
      last_repayment_date: DATE,
      created_at: DATE,
      updated_at: DATE
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "records",
      underscored: false
    }
  );

  Record.associate = function() {
    app.model.Record.belongsTo(app.model.Card, {
      foreignKey: "card_id",
      targetKey: "id"
    });
  };

  return Record;
};
