const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    })
}

module.exports = generateToken;