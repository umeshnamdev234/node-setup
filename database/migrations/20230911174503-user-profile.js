module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('user_profile', 
    { 
      id: {
        allowNull: false, 
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
      },
      profile_pic : {
        type : Sequelize.STRING
      },
      first_name : {
        type : Sequelize.STRING
      },
      last_name : {
        type : Sequelize.STRING
      },
      mobile_number : {
        type : Sequelize.STRING
      },
      address : {
        type : Sequelize.STRING
      },
      city : {
        type : Sequelize.STRING
      },
      // cratedAt : {
      //   type : Sequelize.DATETIME
      // },
      // updatedAt : {
      //   type : Sequelize.DATETIME
      // },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profile');
  }
};
