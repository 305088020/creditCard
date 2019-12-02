"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Bank = app.model.define(
    "bank",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      created_at: DATE,
      updated_at: DATE
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: "banks",
      underscored: false
    }
  );

  Bank.associate = function() {
    app.model.Bank.hasMany(app.model.Card, {
      foreignKey: "bank_id",
      targetKey: "id"
    });
  };

  return Bank;
};
