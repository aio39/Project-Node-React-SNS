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
          validate: {
            isEmail: true,
          },
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
          notEmpty: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(300),
          allowNull: true,
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
