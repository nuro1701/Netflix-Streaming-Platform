const jwt = require('jsonwebtoken');
const User = require('../models/user');

const key = "secret key foo foo foo bar";


async function getUserByMail(mail) {
    return User.findOne({mail: mail});
}

function generateToken(mail) {
    const data = {mail: mail};
    return jwt.sign(data, key);
}


module.exports = {getUserByMail, generateToken};