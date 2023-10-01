const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send("User not found")
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.patch('/users/:id', async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!validOperation) return res.status(400).send('Invalid update request!')

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) return res.status(404).send('User not found')
        res.status(200).send(user)
    }catch(error){
        res.status(400).send(error)
    }
})

app.delete('/users/:id', async (req,res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    }catch(error){
        res.status(500).send(error)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.patch('/tasks/:id', async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'comleted']
    const validOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!validOperation) return res.status(400).send('Invalid update request!')

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

app.delete('/tasks/:id', async (req,res) => {

    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).send('Task not found')
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})