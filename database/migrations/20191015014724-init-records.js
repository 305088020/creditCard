'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, DECIMAL, BOOLEAN } = Sequelize;
    await queryInterface.createTable('records', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      card_id: INTEGER,
      // 金额
      record_amount: DECIMAL(10, 2),
      // 手续费
      record_handling_fee: DECIMAL(10, 2),
      // 日期
      record_day: DATE,
      // 是否已还
      is_flag: BOOLEAN,
      // note
      note: STRING,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('records');
  },
};
