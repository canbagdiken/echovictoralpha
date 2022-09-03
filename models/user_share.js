'use strict';
const {
  Model
} = require('sequelize');
const share_types = require('./share_types');



const Users = require("./").User;


module.exports = (sequelize, DataTypes) => {
  class User_Share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.User_Share, { sourceKey: 'id', foreignKey: 'UserId', as: 'userShares' });
      models.share_types.hasMany(models.User_Share, { sourceKey: 'id', foreignKey: 'shareTypeId', as: 'linkedUsers' });



      models.User_Share.belongsTo(models.User, {sourceKey: 'UserId', foreignKey: 'id', as:'user'});
      models.User_Share.belongsTo(models.share_types, { sourceKey: 'shareTypeId', foreignKey: 'id', as: 'type' });

    }
  }
  User_Share.init({
    code: DataTypes.STRING,
    amount: DataTypes.DECIMAL(9,2),
    UserId:{
      type:DataTypes.INTEGER,
      references: {
        model: Users, // 'Actors' would also work
        key: 'id'
      }
    },

    shareTypeId:{
      type:DataTypes.INTEGER,
      references: {
        model: share_types, // 'Actors' would also work
        key: 'id'
      }
    }

  }, {
    sequelize,
    modelName: 'User_Share',
  });
  return User_Share;
};



