'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class share_types extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    //  models.User_Share.belongsTo(models.share_types);
    }
  }
  share_types.init({
    code: DataTypes.STRING,
    totalvalue: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'share_types',
    tableName: 'Share_Types',
  });
  return share_types;
};