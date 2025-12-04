const User = require('./user-model');
const Playlist = require('./playlist-model');
const PlaylistSong = require('./playlistSong-model')
const Song = require('./song-model') 

User.hasMany(Playlist, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Playlist.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });

User.hasMany(Song, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Song.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });

Playlist.belongsToMany(Song, {
  through: PlaylistSong,
  foreignKey: "playlistId",
  otherKey: "songId"
});
Song.belongsToMany(Playlist, {
  through: PlaylistSong,
  foreignKey: "songId",
  otherKey: "playlistId"
});

module.exports = { User, Playlist, PlaylistSong, Song};
