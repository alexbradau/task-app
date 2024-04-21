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

router.get('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send("User not found")
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

router.patch('/users/:id', async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!validOperation) return res.status(400).send('Invalid update request!')

    try{
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send("User not found")

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()

        if(!user){
            return res.status(404).send('User not found')
        } 

        res.status(200).send(user)
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req,res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    }catch(error){
        res.status(500).send(error)
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

router.post('/users/logout', async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(error){
        console.log(error)
    }
})

module.exports = router