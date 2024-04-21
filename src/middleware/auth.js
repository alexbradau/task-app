const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req,res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisatestrun')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            console.log('User not found')
            throw new Error('User not found')
        }
        req.token = token
        req.user = user
    } catch(e){
        res.status(401).send({error: e.message, message: 'Please Authenticate'})
    }
    next()
}

module.exports = auth