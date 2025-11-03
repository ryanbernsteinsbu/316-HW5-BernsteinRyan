const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('../../../db/postgresql');

// function getID(){
//     out = [...Array(24)];//create empty 24 long Array
//     out.map(() => Math.floor(Math.random() * 16).toString(16)); //fill with random hex
//     return out.join("");//join and return
// }
async function createUsers(data, Model) {
    for (const user of data) { //testData.users
        const newUser = await Model.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            passwordHash: user.passwordHash,
        });
    }
}

async function createPlayLists(data, Model) {
    for (const playlist of data) {
        const newPlaylist = await Model.create({
            _id: playlist._id,
            ownerEmail: playlist.ownerEmail,
            name: playlist.name,
            songs: playlist.songs,
        });
    }
}
async function resetSQL(_user, _playlist) {
    const testData = require("../example-db-data.json")
    console.log("Resetting the SQL DB")
    await createUsers(testData.users, _user);
    await createPlayLists(testData.playlists, _playlist);
}

(async () => {
    try{
        const {User, Playlist} = require('../../../models/postgre/associations')
        await sequelize.authenticate();
        console.log("authenticated");
        await sequelize.sync({ force: true });
        console.log("synced tables");
        await resetSQL(User, Playlist)
    } catch (err){
        console.error("error:" + err.message);
    } finally {
        await sequelize.close();
    }
})();
