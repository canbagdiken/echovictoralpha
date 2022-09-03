'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mail: {
        type: Sequelize.STRING
      },
      
      balance: {
        type: Sequelize.DECIMAL(9,2)
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






    await queryInterface.createTable('Share_Types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },
      totalvalue: {
        type: Sequelize.DECIMAL(9,2)
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



    await queryInterface.createTable('User_Shares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(9,2)
      },
      code: {
        type: Sequelize.STRING
      },
      UserId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      shareTypeId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Share_Types',
          key: 'id',
        },
      },


      


      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })








  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_Shares');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Share_Types');
  }
};