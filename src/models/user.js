const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
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
        unique: true,
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
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisisatestrun')
    user.tokens = user.tokens.concat({token})
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('User with that email is not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Incorrect password')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()

})
userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.pre('deleteOne', {document: true}, async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User