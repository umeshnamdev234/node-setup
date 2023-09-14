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
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    email_otp: DataTypes.STRING,
    is_otp_verified: {
      type:DataTypes.STRING,
      defaultValue:'no'
    },
    profile_image: DataTypes.STRING,
    role: {
      type : DataTypes.INTEGER,
      defaultValue:2
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};