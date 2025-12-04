const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/postgresql');

const Song = sequelize.define("Song", {
    _id: {
        type: DataTypes.STRING(24),
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    youTubeId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    listens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    ownerEmail: {
        type: DataTypes.STRING, 
        allowNull: false,
    }
}, {
    indexes: [
      {
        unique: true,
        fields: ["title", "artist", "year"]
      }
    ]
});

module.exports = Song;
