const User = require('./user-model');
const Playlist = require('./playlist-model');

User.hasMany(Playlist, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Playlist.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });

module.exports = { User, Playlist };
