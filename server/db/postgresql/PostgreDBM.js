const {UserModel, PlaylistModel} = require('../../models/postgre/associations.js')
const DatabaseManager = require("../DatabaseManager.js")
class PostgreDBM extends DatabaseManager{
    constructor(connection, UserModel, PlaylistModel, SongModel, PlaylistSongModel){
        super(connection, UserModel, PlaylistModel);
        this.UserModel = UserModel;
        this.PlaylistModel = PlaylistModel;
        this.SongModel = SongModel;
        this.PlaylistSongModel = PlaylistSongModel;
    }
    // Playlists     
    createPlaylist(body, userId) {
        async function doCreatePlaylist(){
            try {
                const user = await this.UserModel.findOne({ where: { _id: userId } })
                if (!user) throw new Error("User not found");

                const playlist = this.PlaylistModel.create(body);

                return playlist;
            } catch (err) {
                console.error("Error creating playlist:", err.message);
                return null;
            }
        }
        return doCreatePlaylist.bind(this)();
    }
    deletePlaylist(id) {
        async function doDelete() {
            try {
                await this.PlaylistSongModel.destroy({ where: { playlistId: id } });
                const deleted = await this.PlaylistModel.destroy({ where: { _id: id } });
                return deleted > 0;
            } catch (err) {
                console.error("Error deleting playlist:", err.message);
                return false;
            }
        }
        return doDelete.bind(this)();
   }    
   replacePlaylist(id, body) {
        async function doReplace() {
            try {
                const list = await this.PlaylistModel.findByPk(id);
                if (!list) return false;
                
                // update name
                list.name = body.playlist.name;
                await list.save();

                // delete songs
                await this.PlaylistSongModel.destroy({ where: { playlistId: id } });

                // add songs
                for (let i = 0; i < body.songs.length; i++) {
                    await this.PlaylistSongModel.create({
                        playlistId: id,
                        songId: body.songs[i]._id,
                        position: i
                    });
                }

                return true;
            } catch (err) {
                console.error("Error replacing playlist:", err.message);
                return false;
            }
        }
        return doReplace.bind(this)();
    }    
    getPlaylistPairs(email) {
        async function doGetPairs() {
            try {
                const playlists = await this.PlaylistModel.findAll({ where: { ownerEmail: email } });
                if (!playlists || !playlists.length){
                    return [];
                }
                let pairs = [];
                for (let key in playlists) {
                    let list = playlists[key];
                    let pair = {
                        _id: list._id,
                        name: list.name
                    };
                    pairs.push(pair);
                }
                return pairs;

            } catch (err) {
                console.error("Error getting playlist pairs:", err.message);
                return [];
            }
        }
        return doGetPairs.bind(this)();
    }
    getPlaylist(id) {
        async function doGetPlaylist() {
            try {
                const playlist = await this.PlaylistModel.findByPk(id);
                if(playlist){
                    return playlist;
                } else {
                    return null;
                }
            } catch (err) {
                console.error("Error getting playlist:", err.message);
                return null;
            }
        }
        return doGetPlaylist.bind(this)();
    }        
    getPlaylists(){
        async function doGetPlaylists() {
            try {
                const playlists = await this.PlaylistModel.findAll();
                if(playlists){
                    return playlists;
                } else {
                    return null;
                }
            } catch (err) {
                console.error("Error getting playlist:", err.message);
                return null;
            }
        }
        return doGetPlaylists.bind(this)();
    }
    //Users
    createUser(body) {
        function getID(){
            const out = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)); //fill with random hex
            return out.join("");//join and return
        }

        async function doCreateUser() {
            try {
                const userData = {
                    _id: getID(),
                    ...body
                };
                const newUser = await this.UserModel.create(userData);
                return newUser;
            } catch (err) {
                console.error("Error creating user:", err.message);
                return null;
            }
        }
        return doCreateUser.bind(this)();
    }
    getUser(id) {
        async function doGetUser() {
            try {
                const user = await this.UserModel.findOne({ where: { _id: id } });
                if(user){
                    return user;
                } else {
                    return null;
                }
            } catch (err) {
                console.error("Error getting user:", err.message);
                return null;
            }
        }
        return doGetUser.bind(this)();
    }
    findUser(email) {
        async function doFindUser() {
            try {
                const user = await this.UserModel.findOne({ where: { email: email} });
                if(user){
                    return user;
                } else {
                    return null;
                }
            } catch (err) {
                console.error("Error finding user:", err.message);
                return null;
            }
        }
        return doFindUser.bind(this)();
    }
    asyncFindUser(list) {
        async function doAsyncFindUser() {
            try {
                const user = await this.UserModel.findByPk(list.ownerEmail);
                if(user){
                    return user;
                } else {
                    return null;
                }
            } catch (err) {
                console.error("Error async finding user:", err.message);
                return null;
            }
        }
        return doAsyncFindUser.bind(this)();
    }
}

module.exports = PostgreDBM;

