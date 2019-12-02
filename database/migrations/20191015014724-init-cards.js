'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, DOUBLE, DECIMAL } = Sequelize;
    await queryInterface.createTable('cards', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      person_id: INTEGER,
      bank_id: INTEGER,
      code: STRING(30),
      password: STRING(30),
      // 额定额度
      quota: DECIMAL(10, 2),
      // 可用额度
      amount: DECIMAL(10, 2),
      // 费率
      interest: DECIMAL(10, 2),
      // 到账日
      billing_day: INTEGER,
      // 还款日
      repayment_day: INTEGER,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('cards');
  },
};
