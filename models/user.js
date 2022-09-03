'use strict';
const {
  Model
} = require('sequelize');


const User_Share = require("./").User_Share;


var Users = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
/*
  User.hasMany(models.User_Share);


      models.User_Share.belongsTo(models.User);*/
    }
  }
  User.init({
    mail: DataTypes.STRING,    
    balance: DataTypes.DECIMAL(9,2),
    shares: {
      type: DataTypes.VIRTUAL,
      get() {
        
        
        
      },
      set(value) {
        throw new Error('Do not try to set the "shares" value!');
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  
  return User;
};






module.exports = Users