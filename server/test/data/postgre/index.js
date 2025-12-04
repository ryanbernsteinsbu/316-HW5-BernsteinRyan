const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('../../../db/postgresql');
const aaaaaaaa = "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu";
// THESE ARE THE ORIGINAL PLAYLISTS
function getID(){
    out = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)); //fill with random hex
    return out.join("");//join and return
}
function isValidYear(year) {
    const y = parseInt(year, 10);
    return Number.isInteger(y) && y >= 1700 && y <= 2025;
}
function isValidYouTubeId(id) {
    return /^[A-Za-z0-9_-]{11}$/.test(id);
}
function isValidUTF8(str) {
    return !str.includes("�");
}

async function createUsers(data, Model) {
    for (const user of data) { //testData.users
        const newUser = await Model.create({
            _id: getID(),
            userName: user.name,
            email: user.email,
            passwordHash: aaaaaaaa,
        });
    }
}

async function createPlaylist(data, Model) {
        const newPlaylist = await Model.create({
            _id: data._id,
            ownerEmail: data.ownerEmail,
            listeners: 0,
            name: data.name,
        });
}
async function createSong(data, Model) {
        const newSong = await Model.create({
            _id: data._id,
            ownerEmail: data.ownerEmail,
            listens: 0,
            title: data.title,
            artist: data.artist,
            year: data.year,
            youTubeId: data.youTubeId,
        });
}
async function createPlaylistSong(data, Model) {
        const newPlaylistSong = await Model.create({
            position: data.position,
            playlistId: data.playlistId,
            songId: data.songId,
        });
}
async function resetSQL(_user, _playlist, _song, _playlistSong) {
    const testData = require("../example-db-data.json")
    const { readFileSync } = require('fs')
    const fileContent = readFileSync(__dirname+'/../example-db-data.json', 'utf-8');
    const playlisterData = JSON.parse(fileContent);
    let songsMap = [];

    console.log("Resetting the SQL DB")
    await createUsers(testData.users, _user);

    let playlist = playlisterData.playlists.shift();

    while (playlist) {

        let playlistSongs = [];
        let playlistId = getID(); 

        const created = await createPlaylist({
            _id: playlistId,
            ownerEmail: playlist.ownerEmail,
            name: playlist.name
        }, _playlist).catch(err => console.error("Playlist insert failed", err));

        let song = playlist.songs.shift();

        while (song) {
            let key = song.title.trim().toLowerCase() + "-" + song.artist.trim().toLowerCase() + "-" + song.year;
            let value = songsMap[key];
            if (value) {
                //add the existing id to the playlist
                playlistSongs.push({
                    playlistId,
                    songId: value,
                    position: playlistSongs.length
                });
            }
            else {
                //create an id with getID and add it to the playlist
                let newSongId = getID();
                songsMap[key] = newSongId;

                // Save the song in SQL
                await createSong({
                    _id: newSongId,
                    ownerEmail: playlist.ownerEmail,
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId
                }, _song);
                //add entry to playlistSongs list
                playlistSongs.push({
                    playlistId,
                    songId: newSongId,
                    position: playlistSongs.length
                });
            }
            song = playlist.songs.shift();    
        }
        //save the playlist to db

        //save all song entries to playlistSong
        for (let entry of playlistSongs) {
            await createPlaylistSong(entry, _playlistSong);
        }

        playlist = playlisterData.playlists.shift();
    }
}

(async () => {
    try{
        const { User, Playlist, PlaylistSong, Song} = require('../../../models/postgre/associations')
        await sequelize.authenticate();
        console.log("authenticated");
        await sequelize.sync({ force: true });
        console.log("synced tables");
        await resetSQL(User, Playlist, Song, PlaylistSong)
    } catch (err){
        console.error("error:" + err.message);
    } finally {
        await sequelize.close();
    }
})();
