'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

     await queryInterface.bulkInsert('Users', [{
      id:1,
      mail: 'can@bagdiken.com',
      balance:100,
      createdAt: new Date(),
      updatedAt: new Date(),
         
       }], {})
       
     await queryInterface.bulkInsert('Users', [{
      id:2,
      mail: 'elon@musk.com',
      balance:100000,
      createdAt: new Date(),
      updatedAt: new Date(),
         
       }], {})
       
     await queryInterface.bulkInsert('Users', [{
      id:3,
      mail: 'fidel@castro.com',
      balance:100,
      createdAt: new Date(),
      updatedAt: new Date(),
         
       }], {})
       
      
     await queryInterface.bulkInsert('Share_Types', [{
      id:1,
      code:'ABC',
      totalvalue:1000000,
      createdAt: new Date(),
      updatedAt: new Date(),
         
       }], {})
      
      await queryInterface.bulkInsert('User_Shares', [{
      UserId:1,
      code:'ABC',
      shareTypeId:1,
      amount:1.5,
      createdAt: new Date(),
      updatedAt: new Date(),
          
        }], {})
       
      
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
