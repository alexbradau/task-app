const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!validOperation) return res.status(400).send('Invalid update request!')

    try{
        const user = req.user
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        res.status(200).send(user)
    }catch(error){
        console.log(error)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try{
        const user = await req.user.deleteOne()
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    }catch(error){
        console.log(error)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.save()
        res.status(200).send({user, token})
    }catch(error){
        console.log(error)
        res.status(500).send(error.message)
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user.email + ' logged out successfully')
    } catch(error){
        console.log('Cannot log out user')
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user.email + ' logged out of all sessions')
    } catch(error){
        res.status(500).send()
        console.log('Cannot logout user from all sessions')
    }
})

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return callback(new Error('File is not an image'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req,res) => {
        res.send()
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
    console.log('File is not an image')
})

module.exports = router