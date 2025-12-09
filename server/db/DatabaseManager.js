class DatabaseManager{
    constructor(connection, UserModel, PlaylistModel){
        this.connection = connection;
        this.UserModel = UserModel;
        this.PlaylistModel = PlaylistModel;
    }
    createPlaylist(body, userId){
        return body;
    }
    deletePlaylist(id){
        return false;
    }
    replacePlaylist(id, body){
        return body;
    }
    getPlaylistPairs(email){
        return null;
    }
    queryPlaylistPairs(body){
        return null;
    }
    getPlaylist(id){
        return null;
    }
    getPlaylists(){
        return null;
    }
    createUser(body){
        return null;
    }
    getUser(id){
        return null;
    }
    findUser(email){
        return null;
    }
    asyncFindUser(list){
        return 
    }
    createSong(body, userId){
        return null;
    }
    deleteSong(id){
        return null;
    }
    replaceSong(id, body){
        return null;
    }
    getSong(id){
        return null;
    }
    getSongs(body){
        return null;
    }
    addPlaylistSong(songId, playlistId){
        return null;
    }
}

module.exports = DatabaseManager;
