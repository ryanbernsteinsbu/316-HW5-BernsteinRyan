const PlaylistModel = require("../../models/mongodb/playlist-model");
const UserModel = require("../../models/mongodb/user-model");
const DatabaseManager = require("../DatabaseManager.js")
class MongoDBM extends DatabaseManager{
    constructor(connection, UserModel, PlaylistModel){
        super(connection, UserModel, PlaylistModel);
        this.PlaylistModel = PlaylistModel;
        this.UserModel = UserModel;
    }
    createPlaylist(body, userId) {
        async function doCreatePlaylist(){
            try {
                const playlist = new this.PlaylistModel(body);

                const user = await this.UserModel.findById(userId);
                if (!user) throw new Error("User not found");

                user.playlists.push(playlist._id);
                await user.save();
                await playlist.save();

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
                const deleted = await this.PlaylistModel.findByIdAndDelete(id);
                return !!deleted; //convert to boolean
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
                const list = await this.PlaylistModel.findById(id);
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
        return doReplace.bind(this)();
    }    
    getPlaylistPairs(email) {
        async function doGetPairs() {
            try {
                const playlists = await this.PlaylistModel.find({ ownerEmail: email });
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
                const playlist = await this.PlaylistModel.findById(id);
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
                const playlists = await this.PlaylistModel.find({});
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
    createUser(body) {
        async function doCreateUser() {
            try {
                const newUser = new this.UserModel(body);
                await newUser.save();
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
                const user = await this.UserModel.findById(id);
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
                const user = await this.UserModel.findOne({ email: email });
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
                const user = await this.UserModel.findOne({ email: list.ownerEmail });
                console.log(user.firstName);
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

module.exports = MongoDBM;
