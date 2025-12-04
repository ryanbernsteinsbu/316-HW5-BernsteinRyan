const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/postgresql');

const User = sequelize.define("User", {
    _id: {
        type: DataTypes.STRING(24),
        allowNull: false,
        unique: true},
    userName: {
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
    avatar: {
        type: DataTypes.STRING,
    },
});

module.exports = User;

