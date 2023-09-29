const mongoose = require('mongoose')
const validator = require('validator')

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
    },
    email: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        toLowerCase: true,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('Password may not contain \'password\'')
            if(value.length <= 6) throw new Error('Password must be greater than 6 characters')
        }
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
})

const task = new Task({
    description: 'Make more money',
})

task.save()

const me = new User({
    name: 'Alex',
    age: 29,
    email: 'alex@email.com',
    password: 'thisismypass'
})

me.save()