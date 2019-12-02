'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Person = app.model.define('person', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    created_at: DATE,
    updated_at: DATE,
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'persons',
    underscored: false,
  });

  Person.associate = function() {
    app.model.Person.hasMany(app.model.Card, { foreignKey: 'person_id', targetKey: 'id' });
  };

  return Person;
};
