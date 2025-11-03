const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/postgresql');

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email : {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;

