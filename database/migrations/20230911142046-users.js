module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('users', 
    { 
      id: {
        allowNull: false, 
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
      },
      name : {
        type : Sequelize.STRING
      },
      email : {
        type : Sequelize.STRING
      },
      password : {
        type : Sequelize.STRING
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
