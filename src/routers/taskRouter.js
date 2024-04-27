const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const limit = req.query.limit
        const skip = req.query.skip
        for( var param in req.query){
            if(param !== 'completed'){
                req.query[param] = null
            }
        }
        const tasks = await Task.find({...req.query, owner: req.user.id}).limit(parseInt(limit) || 0).skip(parseInt(skip) || 0)
        res.status(200).send(tasks)
    } catch (e) {
        console.log(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await findTaskByOwnerAndId(req)
        if (!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    } catch (error) {
        console.log(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'comleted']
        const validOperation = updates.every(update => allowedUpdates.includes(update))

        if (!validOperation) return res.status(400).send('Invalid update request!')
        const task = await findTaskByOwnerAndId(req)

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        task.save()

        if (!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOneAndDelete({ _id, owner: req.user.id })
        if (!task) return res.status(404).send('Task not found')
        res.send(task)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router

async function findTaskByOwnerAndId(req) {
    const _id = req.params.id
    const task = await Task.findOne({ _id, owner: req.user.id })
    return task
}
