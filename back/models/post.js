const DataTypes = require('sequelize');

const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isTemp: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        paranoid: true,
        modelName: 'Post',
        tableName: 'posts',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
      },
    );
  }

  //  N:1 User
  //  M:N HashTag
  //  1: N Comment
  //  1: N Image
  //  M:N BookMark(with User)
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, {
      through: 'PostHashtag',
    });
    db.Post.hasMany(db.Comment, { onDelete: 'cascade', hooks: true });
    db.Post.hasMany(db.Image, { onDelete: 'cascade', hooks: true });
    db.Post.belongsToMany(db.User, { through: 'BookMark', as: 'Marker' });
  }
};
