'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
          isEmail: true,
      },
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  otp: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  is_verified: {
      type: DataTypes.ENUM('yes', 'no'),
      defaultValue: 'no',
      allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'user'),
    defaultValue: 'user',
    allowNull: true,
  },
  permission: {
    type: DataTypes.ENUM(1, 2, 3),
    defaultValue: 3,
    allowNull: true,
  },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};