const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/postgresql');

const PlaylistSong = sequelize.define("PlaylistSong", {
    playlistId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "Playlists",
            key: "_id"
        }
    },
    songId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "Songs",
            key: "_id"
        }
    },
    listeners: {
        type: DataTypes.INTEGER,
    },
});

module.exports = PlaylistSong;
