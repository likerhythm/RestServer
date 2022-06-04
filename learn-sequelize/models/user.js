const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
		// timestamps: true이면 createdAt과 updatedAt을 자동으로 생성해줌
      timestamps: false,
		// createdAt -> created_at으로 자동 변경해줌
      underscored: false,
		// 모델이름은 js에서 쓰는 이름, 테이블이름은 DB에서 쓰는 이름.
		// 모델 이름이 User 이면 DB에서의 테이블 이름은 users이다.
      modelName: 'User',
      tableName: 'users',
		// paranoid: true이면 deletedAt 기능 사용 가능
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
};
