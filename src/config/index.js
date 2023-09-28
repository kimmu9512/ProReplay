require('dotenv').config();
const config = {
    googleClientID: process.env.CLIENT_ID,
    googleClientSecret: process.env.CLIENT_SECRET,
    riotKey: process.env.RIOT_KEY,
};
module.exports = config;