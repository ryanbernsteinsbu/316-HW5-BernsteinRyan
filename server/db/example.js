const DatabaseManager = require("../DatabaseManager.js");

class PostgreDBM extends DatabaseManager {
    constructor(connection, UserModel, PlaylistModel, SongModel, PlaylistSongModel) {
        super(connection, UserModel, PlaylistModel);
        this.UserModel = UserModel;
        this.PlaylistModel = PlaylistModel;
        this.SongModel = SongModel;
        this.PlaylistSongModel = PlaylistSongModel;
    }

    // -----------------------------
    // PLAYLISTS
    // -----------------------------
    async createPlaylist(body, userId) {
        try {
            const user = await this.UserModel.findOne({ where: { _id: userId } });
            if (!user) throw new Error("User not found");

            const playlist = await this.PlaylistModel.create({
                ...body,
                ownerEmail: user.email
            });

            return playlist;
        } catch (err) {
            console.error("Error creating playlist:", err.message);
            return null;
        }
    }

    async deletePlaylist(id) {
        try {
            await this.PlaylistSongModel.destroy({ where: { playlistId: id } });
            const deleted = await this.PlaylistModel.destroy({ where: { _id: id } });
            return deleted > 0;
        } catch (err) {
            console.error("Error deleting playlist:", err.message);
            return false;
        }
    }

    async replacePlaylist(id, body) {
        try {
            const playlist = await this.PlaylistModel.findByPk(id);
            if (!playlist) return false;

            playlist.name = body.name;
            await playlist.save();

            // CLEAR OLD SONGS
            await this.PlaylistSongModel.destroy({ where: { playlistId: id } });

            // ADD NEW SONGS IN ORDER
            if (Array.isArray(body.songs)) {
                for (let i = 0; i < body.songs.length; i++) {
                    await this.PlaylistSongModel.create({
                        playlistId: id,
                        songId: body.songs[i],
                        position: i
                    });
                }
            }

            return true;
        } catch (err) {
            console.error("Error replacing playlist:", err.message);
            return false;
        }
    }

    async getPlaylistPairs(email) {
        try {
            const playlists = await this.PlaylistModel.findAll({
                where: { ownerEmail: email },
                attributes: ["_id", "name"]
            });

            return playlists || [];
        } catch (err) {
            console.error("Error getting playlist pairs:", err.message);
            return [];
        }
    }

    async getPlaylist(id) {
        try {
            return await this.PlaylistModel.findByPk(id, {
                include: {
                    model: this.SongModel,
                    through: { attributes: ["position"] }
                }
            });
        } catch (err) {
            console.error("Error getting playlist:", err.message);
            return null;
        }
    }

    async getPlaylists() {
        try {
            return await this.PlaylistModel.findAll({
                include: this.SongModel
            });
        } catch (err) {
            console.error("Error getting playlists:", err.message);
            return null;
        }
    }

    // -----------------------------
    // USERS
    // -----------------------------
    createUser(body) {
        const getID = () =>
            [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

        const data = {
            _id: getID(),
            ...body
        };

        return this.UserModel.create(data)
            .then(user => user)
            .catch(err => {
                console.error("Error creating user:", err.message);
                return null;
            });
    }

    async getUser(id) {
        return await this.UserModel.findOne({ where: { _id: id } });
    }

    async findUser(email) {
        return await this.UserModel.findOne({ where: { email } });
    }

    async asyncFindUser(list) {
        return await this.UserModel.findByPk(list.ownerEmail);
    }

    // -----------------------------
    // SONGS — NEW FUNCTIONS
    // -----------------------------
    async findSong(id) {
        try {
            return await this.SongModel.findByPk(id);
        } catch (err) {
            console.error("Error finding song:", err.message);
            return null;
        }
    }

    async findSongsByArtist(artist) {
        try {
            return await this.SongModel.findAll({
                where: { artist }
            });
        } catch (err) {
            console.error("Error finding songs by artist:", err.message);
            return [];
        }
    }

    async findSongsByTitleSubstring(fragment) {
        try {
            return await this.SongModel.findAll({
                where: {
                    title: { [Op.iLike]: `%${fragment}%` }
                }
            });
        } catch (err) {
            console.error("Error searching titles:", err.message);
            return [];
        }
    }

    async findOrCreateSong(songData) {
        try {
            let song = await this.SongModel.findOne({
                where: {
                    title: songData.title,
                    artist: songData.artist,
                    year: songData.year
                }
            });

            if (song) return song;

            return await this.SongModel.create(songData);
        } catch (err) {
            console.error("Error findOrCreateSong:", err.message);
            return null;
        }
    }

    async deleteSong(id) {
        try {
            await this.PlaylistSongModel.destroy({ where: { songId: id } });
            const deleted = await this.SongModel.destroy({ where: { _id: id } });
            return deleted > 0;
        } catch (err) {
            console.error("Error deleting song:", err.message);
            return false;
        }
    }
}

module.exports = PostgreDBM;
