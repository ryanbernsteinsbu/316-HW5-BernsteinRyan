const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/postgresql');

const Playlist = sequelize.define("Playlist", {
    _id: {
        type: DataTypes.STRING(24),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    songs: {
        type: DataTypes.JSONB, 
        defaultValue: [],
    },
    ownerEmail: {
        type: DataTypes.STRING, 
        allowNull: false,
    }
});

module.exports = Playlist;
