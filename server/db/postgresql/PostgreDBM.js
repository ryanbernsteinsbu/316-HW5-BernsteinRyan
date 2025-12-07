const { Sequelize } = require("sequelize");
const { UserModel, PlaylistModel, PlaylistSongModel, SongModel} = require('../../models/postgre/associations.js')
const DatabaseManager = require("../DatabaseManager.js")
class PostgreDBM extends DatabaseManager{
    constructor(connection, UserModel, PlaylistModel, SongModel, PlaylistSongModel){
        super(connection, UserModel, PlaylistModel);
        this.connection = connection;
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
       console.log(JSON.stringify(body));
       console.log(body.name);
        async function doReplace() {
            try {
                const realBody = (body.name) ? body : body.playlist; //DO NOT REMOVE: no idea why this is needed I think its a java bug 
                console.log(realBody.name);
                const list = await this.PlaylistModel.findByPk(id);
                if (!list) return false;
                
                // update name
                list.name = realBody.name;
                await list.save();
                // console.log("==========")
                // console.log(realBody.songs);
                if(!realBody.songs){
                    return true;
                }
                //delete songs
                await this.PlaylistSongModel.destroy({ where: { playlistId: id } });

                // add songs
                for (let i = 0; i < realBody.songs.length; i++) {
                    const songData = realBody.songs[i];


                    await this.PlaylistSongModel.create({
                        playlistId: id,
                        songId: songData._id,
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
                    const sampleSongs = await list.getSongs({
                        joinTableAttributes: ["position"],
                        order: [[this.connection.sequelize.literal('"PlaylistSong"."position"'), "ASC"]],
                        limit: 3
                    });
                    const user = await this.UserModel.findByPk(list.ownerEmail);
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerEmail: list.ownerEmail,
                        ownerName: user.toJSON().username,
                        sample: sampleSongs.map(song => song.toJSON()), //place the list of 3 songs here
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
    queryPlaylistPairs(body) {
        async function doGetPairs() {
            try {
                // console.log(body)
                const {
                    playlistName,
                    userName,
                    songTitle,
                    songArtist,
                    songYear,
                    sortOrder
                } = body;
                const { Op } = require('sequelize');
                const filteredSongs = []
                if (songYear || songArtist || songTitle){
                    filteredSongs = await this.SongModel.findAll({
                        where: {
                            ...(songTitle ? {title: { [Op.like]: `%${songTitle}%`}} : {}),
                            ...(songArtist ? {artist: { [Op.like]: `%${songArtist}%`}} : {}),
                            ...(songYear ? {year: Number(songYear)} : {})
                        },
                        attributes: ['_id'] 
                    });
                } 
                const songIds = filteredSongs.map(s => s._id);
                //create a list of all valid song songIds
                //if no results return []
                if((songYear || songArtist || songTitle) && songIds.length == 0){
                    return [];
                }

                // get email
                const userEmail = userName ? await this.resolveUserEmail(userName) : null;
                //generate playlist where conditions
                const playlistWhere = {
                    ...(playlistName ? { name: { [Op.like]: `%${playlistName}%` } } : {}),
                    ...(userEmail && userName ? { ownerEmail:  userEmail} : {}),
                };
                console.log("playlistWhere: " + JSON.stringify(playlistWhere))
                const playlists = await this.PlaylistModel.findAll(
                    { where: { ...playlistWhere } }
                );
                if (!playlists || !playlists.length){
                    return [];
                }

                let matchingPlaylists = playlists;

                if (songIds.length > 0) {
                    matchingPlaylists = [];

                    for (const playlist of playlists) {
                        const songsInPlaylist = await playlist.getSongs({
                            joinTableAttributes: [],
                            attributes: ['_id']
                        });

                        const playlistSongIds = songsInPlaylist.map(s => s._id);

                        // Check intersection
                        const intersects = playlistSongIds.some(id => songIds.includes(id));

                        if (intersects) {
                            matchingPlaylists.push(playlist);
                        }
                    }
                }

                if (!matchingPlaylists.length) return [];

                let pairs = [];

                for (let key in matchingPlaylists) {
                    let list = matchingPlaylists[key];
                    const sampleSongs = await list.getSongs({
                        joinTableAttributes: [],
                        order: [[this.connection.sequelize.literal('"PlaylistSong"."position"'), "asc"]],
                        limit: 3
                    });
                    const user = await this.UserModel.findByPk(list.ownerEmail);
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerEmail: list.ownerEmail,
                        ownerName: user.toJSON().username,
                        sample: sampleSongs.map(song => song.toJSON()), //place the list of 3 songs here
                    };
                    pairs.push(pair);
                }
                return pairs;
                // return [1,2,3,3];

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
                const playlist = await this.PlaylistModel.findByPk(id, {
                    include: [
                        {
                            model: this.SongModel,
                            as: "songs",
                            through: { attributes: ["position"] }
                        }
                    ],
                    order: [[this.connection.sequelize.literal('"songs->PlaylistSong"."position"'), 'ASC']]
                });
                return playlist ? playlist.toJSON() : null;
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
    async resolveUserEmail(username) {
        try {
            if (!username) return null;

            const user = await this.UserModel.findOne({
                where: { username: username }
            });

            return user ? user.email : null;

        } catch (err) {
            console.error("Error resolving email:", err.message);
            return null;
        }
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
    // Songs
    // await this.SongModel.update(
    //     {
    //         ownerEmail: songData.ownerEmail,
    //         title: songData.title,
    //         artist: songData.artist,
    //         year: songData.year,
    //         youTubeId: songData.youTubeId
    //     },
    //     { where: { _id: songData._id } }
    // );
    createSong(body, userId) {
        async function doCreateSong(){
            try {
                const user = await this.UserModel.findOne({ where: { _id: userId } })
                if (!user) throw new Error("User not found");

                const song = this.SongModel.create(body);

                return song;
            } catch (err) {
                console.error("Error creating song:", err.message);
                return null;
            }
        }
        return doCreateSong.bind(this)();
    }
    deleteSong(id) {
        async function doDelete() {
            try {
                await this.PlaylistSongModel.destroy({ where: { songId: id } });
                const deleted = await this.SongModel.destroy({ where: { _id: id } });
                return deleted > 0;
            } catch (err) {
                console.error("Error deleting song:", err.message);
                return false;
            }
        }
        return doDelete.bind(this)();
   }    
   replaceSong(id, body) {
        async function doReplace() {
            try {
                const realBody = (body.title) ? body : body.song; //DO NOT REMOVE: no idea why this is needed I think its a java bug 
                const song = await this.SongModel.findByPk(id);
                if (!song) return false;
                
                // update song
                song.title = realBody.title;
                song.artist = realBody.artist;
                song.year = realBody.year;
                song.youTubeId = realBody.youTubeId;
                await song.save();
                return true;
            } catch (err) {
                console.error("Error replacing playlist:", err.message);
                return false;
            }
        }
        return doReplace.bind(this)();
    }
    getSong(id){
        async function doGet(){
            try{
                const song = await this.SongModel.findByPk(id);
                return song ? song : null;
            } catch (err) {
                console.error("Error retrieving song:", err.message);
                return false;
            }

        }
        return doGet.bind(this)();
    }
    getSongs(body){
        async function doGet(){
            try{
                console.log(body);
                const {songTitle, songArtist, songYear, sortOrder} = body;
                const { Op } = require('sequelize');

                const where = {
                    ...(songTitle ? {title:{[Op.like]: `%${songTitle}%`}}: {}),
                    ...(songArtist ? {artist:{[Op.like]: `%${songArtist}%`}}: {}),
                    ...(songYear ? { year: Number(songYear) } : {})
                }
                const order = {

                }
                const songs = await this.SongModel.findAll({where});
                return songs ? songs : null;
            } catch (err) {
                console.error("Error retrieving songs:", err.message);
                return false;
            }

        }
        return doGet.bind(this)();
    }
}

module.exports = PostgreDBM;

