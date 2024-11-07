const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Homework = sequelize.define('Homework', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description : {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: (new Date()).toUTCString()
    }
});

module.exports = Homework;