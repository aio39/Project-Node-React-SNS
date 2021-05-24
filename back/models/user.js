const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(40),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
      },
      {
        paranoid: true,
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'BookMark', as: 'MarkedPost' });
  }
};
