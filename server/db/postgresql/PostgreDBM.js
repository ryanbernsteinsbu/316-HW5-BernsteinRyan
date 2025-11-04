const {UserModel, PlaylistModel} = require('../../models/postgre/associations.js')
const DatabaseManager = require("../DatabaseManager.js")
class PostgreDBM extends DatabaseManager{
    constructor(connection, UserModel, PlaylistModel){
        super(connection, UserModel, PlaylistModel);
    }
    createPlaylist(body, userId) {
        async function doCreatePlaylist(){
            try {
                const user = await UserModel.findOne({ where: { _id: userId } })
                if (!user) throw new Error("User not found");

                const playlist = new PlaylistModel.create(body);

                return playlist;
            } catch (err) {
                console.error("Error creating playlist:", err.message);
                return null;
            }
        }
        return doCreatePlaylist();
    }
    deletePlaylist(id) {
        async function doDelete() {
            try {
                const deleted = await PlaylistModel.destroy({ where: { _id: id } });
                return deleted > 0;
            } catch (err) {
                console.error("Error deleting playlist:", err.message);
                return false;
            }
        }
        return doDelete();
    }    
   replacePlaylist(id, body) {
        async function doReplace() {
            try {
                const list = await PlaylistModel.findByPk(id);
                if (!list) return false;

                list.name = body.playlist.name;
                list.songs = body.playlist.songs;
                await list.save();
                return true;
            } catch (err) {
                console.error("Error replacing playlist:", err.message);
                return false;
            }
        }
        return doReplace();
    }    
    getPlaylistPairs(email) {
        async function doGetPairs() {
            try {
                const playlists = await PlaylistModel.findAll({ where: { ownerEmail: email } });
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
        return doGetPairs();
    }
    getPlaylist(id) {
        async function doGetPlaylist() {
            try {
                const playlist = await PlaylistModel.findByPk(id);
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
        return doGetPlaylist();
    }        
    getPlaylists(){
        async function doGetPlaylists() {
            try {
                const playlists = await PlaylistModel.findAll();
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
        return doGetPlaylists();
    }
    createUser(body) {
        function getID(){
            out = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)); //fill with random hex
            return out.join("");//join and return
        }

        async function doCreateUser() {
            try {
                const userData = {
                    _id: getID(),
                    ...body
                };
                const newUser = await UserModel.create(userData);
                return newUser;
            } catch (err) {
                console.error("Error creating user:", err.message);
                return null;
            }
        }
        return doCreateUser();
    }
    getUser(id) {
        async function doGetUser() {
            try {
                const user = await UserModel.findOne({ where: { _id: id } });
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
        return doGetUser();
    }
    findUser(email) {
        async function doFindUser() {
            try {
                const user = await UserModel.findOne({ where: { email: email} });
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
        return doFindUser();
    }
    asyncFindUser(list) {
        async function doAsyncFindUser() {
            try {
                const user = await UserModel.findByPk(list.ownerEmail);
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
        return doAsyncFindUser();
    }
}

module.exports = PostgreDBM;

