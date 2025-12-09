const dbm = require('../db/index.js')
const auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    
    try {
        const newPlaylist = await dbm.createPlaylist(body, req.userId);
        if (newPlaylist) {
            return res.status(201).json({ playlist: newPlaylist });
        } else {
            return res.status(400).json({ errorMessage: 'Playlist Not Created!' });
        }
    } catch (err) {
        console.error("createPlaylist error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    try{
        const playlist = await dbm.getPlaylist(req.params.id);
        if(!playlist){
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }
        const user = await dbm.asyncFindUser(playlist); //get user
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            })
        }
        // console.log("dbm user:" + user._id);
        // console.log("req user:" + req.userId);
        if (user._id == req.userId) { //verify user
            console.log("correct user!");
            const deleted = await dbm.deletePlaylist(playlist._id);
            if(deleted){ //detete playlist
                return res.status(200).json({});
            } else {
                return res.status(400).json({ 
                    errorMessage: "delete error" 
                });
            }
        } else {
            console.log("incorrect user!");
            return res.status(400).json({ 
                errorMessage: "authentication error" 
            });
        }
    } catch(err) {
                console.error("deletePlaylist error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
getPlaylistById = async (req, res) => {
    // if(auth.verifyUser(req) === null){
    //     return res.status(400).json({
    //         errorMessage: 'UNAUTHORIZED'
    //     })
    // }
    try {
        console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
        const list = await dbm.getPlaylist(req.params.id);
        if (!list) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        const user = await dbm.asyncFindUser(list); //get user
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            })
        }

        return res.status(200).json({ success: true, playlist: list })
    } catch(err) {
        console.error("getPlaylistById error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    try {
        console.log("getPlaylistPairs");
        const user = await dbm.getUser(req.userId);
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            })
        }
        const playlistPairs = await dbm.getPlaylistPairs(user.email);
        if(playlistPairs){
            return res.status(200).json({ success: true, idNamePairs: playlistPairs})
        } else {
            return res
                .status(404)
                .json({success:false, error: "Playlists not found"})
        }
    } catch(err) {
        console.error("getPlaylistPairs error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
queryPlaylistPairs = async (req, res) => {
    // if(auth.verifyUser(req) === null){
    //     return res.status(400).json({
    //         errorMessage: 'UNAUTHORIZED'
    //     })
    // }
    try {
        console.log("queryPlaylistPairs");
        const playlistPairs = await dbm.queryPlaylistPairs(req.body);
        console.log(playlistPairs);
        if(playlistPairs){
            return res.status(200).json({ success: true, idNamePairs: playlistPairs})
        } else {
            return res
                .status(404)
                .json({success:false, error: "Playlists not found"})
        }
    } catch(err) {
        console.error("queryPlaylistPairs error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
getPlaylists = async (req, res) => {
    // if(auth.verifyUser(req) === null){
    //     return res.status(400).json({
    //         errorMessage: 'UNAUTHORIZED'
    //     })
    // }
    try{
        const playlists = await dbm.getPlaylists()
        if(!playlists){
            return res.status(400).json({ success: false, error: err })
        } else {
            return res.status(200).json({ success: true, data: playlists })
        }
    } catch(err) {
        console.error("getPlaylists error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    try{
        const body = req.body.playlist;
        console.log("updatePlaylist: " + JSON.stringify(body));
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }

        const list = await dbm.getPlaylist(req.params.id);
        if(!list){
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        const user = await dbm.asyncFindUser(list); //get user
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            })
        }

        if (user._id != req.userId) { //verify user
            console.log("incorrect user!");
            return res.status(400).json({ success: false, description: "authentication error" });
        } else {
            console.log("correct user!");
            const updated = await dbm.replacePlaylist(list._id, body);
            console.log(updated);
            if(updated){
                return res.status(200).json({
                    success: true,
                    id: list._id,
                    message: 'Playlist updated!',
                });
            } else {
                return res.status(400).json({
                    success: false,
                    id: list._id,
                    message: 'Playlist failed to update',
                });
            }
        }
    } catch(err){
        console.error("updatePlaylist error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}

createSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    const body = req.body;
    console.log("createSong body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a song',
        });
    }

    try {
        const newSong = await dbm.createSong(body, req.userId);
        if (newSong) {
            return res.status(201).json({ song: newSong });
        } else {
            return res.status(400).json({ errorMessage: 'Song not created!' });
        }
    } catch (err) {
        console.error("createSong error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}

deleteSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    console.log("delete Song with id: " + JSON.stringify(req.params.id));

    try {
        const song = await dbm.getSong(req.params.id);
        if(!song){
            return res.status(404).json({
                errorMessage: 'Song not found!',
            });
        }

        const user = await dbm.findUser(song.ownerEmail);
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            });
        }

        if (user._id === req.userId) {
            const deleted = await dbm.deleteSong(song._id);
            if(deleted){
                return res.status(200).json({});
            } else {
                return res.status(400).json({ 
                    errorMessage: "Delete error" 
                });
            }
        } else {
            return res.status(400).json({ 
                errorMessage: "Authentication error" 
            });
        }
    } catch(err) {
        console.error("deleteSong error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
replaceSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    const body = req.body.song;
    console.log("replaceSong body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a song to update',
        });
    }

    try {
        const song = await dbm.getSong(req.params.id);
        if(!song){
            return res.status(404).json({
                errorMessage: 'Song not found!',
            });
        }

        const user = await dbm.findUser(song.ownerEmail);
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            });
        }

        if (user._id !== req.userId) {
            return res.status(400).json({ success: false, description: "Authentication error" });
        }

        const updated = await dbm.replaceSong(song._id, body);
        if(updated){
            return res.status(200).json({
                success: true,
                id: song._id,
                message: 'Song updated!',
            });
        } else {
            return res.status(400).json({
                success: false,
                id: song._id,
                message: 'Song failed to update',
            });
        }
    } catch(err){
        console.error("replaceSong error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}

getSong = async (req, res) => {

    try {
        const song = await dbm.getSong(req.params.id);
        if(!song){
            return res.status(404).json({
                errorMessage: 'Song not found!',
            });
        }

        const user = await dbm.findUser(song.ownerEmail);
        if(!user){
            return res.status(404).json({
                errorMessage: 'User not found!',
            });
        }

        return res.status(200).json({ success: true, song: song });
    } catch(err){
        console.error("getSong error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}

getSongs = async (req, res) => {

    try {
        // console.log(req.body);
        const songs = await dbm.getSongs(req.body);
        if(!songs){
            return res.status(404).json({
                errorMessage: 'No songs found',
            });
        }

        return res.status(200).json({ success: true, songs: songs });
    } catch(err){
        console.error("getSongs error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}
addPlaylistSong = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        });
    }

    try {
        const songs = await dbm.addPlaylistSong(req.body.songId, req.body.playlistId);
        if(!songs){
            return res.status(404).json({
                errorMessage: 'entry not created',
            });
        }

        return res.status(200).json({ success: true, playlistSong: songs });
    } catch(err){
        console.error("getSongs error:", err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    }
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    queryPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    createSong,
    deleteSong,
    replaceSong,
    getSong,
    getSongs,
    addPlaylistSong
}
