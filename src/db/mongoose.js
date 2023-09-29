const mongoose = require('mongoose')

const connectionURL = 'mongodb+srv://alexbradau:d34dp00l@hvar.v9wlupn.mongodb.net/task-manager'

mongoose.connect(connectionURL)
    .catch((error) => console.log(error))

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const task = new Task({
    description: 'Make more money',
    completed: false
})

task.save()

const me = new User({
    name: 'Alex',
    age: 29
})

me.save()