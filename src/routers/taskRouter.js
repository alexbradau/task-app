const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'comleted']
    const validOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!validOperation) return res.status(400).send('Invalid update request!')

    try{

        const task = await Task.findById(req.params.id)
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        
        task.save()

        if(!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', async (req,res) => {

    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).send('Task not found')
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router