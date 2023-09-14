'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    otp: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    is_verified: {
        type: Sequelize.ENUM('yes', 'no'),
        defaultValue: 'no',
        allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'user'),
      defaultValue: 'user',
      allowNull: true,
    },
    permission: {
      type: DataTypes.ENUM('1', '2', '3'),
      defaultValue: 3,
      allowNull: true,
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};