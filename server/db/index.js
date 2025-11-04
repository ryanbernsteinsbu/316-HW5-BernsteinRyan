const dotenv = require('dotenv')
dotenv.config();

let dbm;
if(process.env.DB_TYPE == "mongo"){
    const db = require('./mongodb/index.js'); // TODO
    db.on('error', console.error.bind(console, 'Database connection error:'))
    const MongoDBM = require("./mongodb/MongoDBM.js");
    const MongoPlaylist = require("../models/mongodb/playlist-model.js");
    const MongoUser = require("../models/mongodb/user-model.js");
    dbm = new MongoDBM(db, MongoUser, MongoPlaylist);
} else {
    const db = require('./postgresql/index.js'); // TODO
    const PostgreDBM = require("./postgresql/PostgreDBM.js");
    const {UserModel, PlaylistModel} = require('../models/postgre/associations.js')
    dbm = new PostgreDBM(db, UserModel, PlaylistModel);
}

module.exports = dbm;

