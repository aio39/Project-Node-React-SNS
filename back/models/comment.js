const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isRoot: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        paranoid: true,
        modelName: 'Comment',
        tableName: 'comments',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
        hook: {
          afterFind: (comment, options) => {
            console.log(comment);
            if (comment.isDeleted) {
              comment.content = 'Deleted';
            }
          },
        },
      },
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Comment.hasMany(db.Comment, { as: 'Reply', foreignKey: 'ReplyToId' });
  }
};
