const mongoose = require('mongoose')

const connectionURL = 'mongodb+srv://alexbradau:d34dp00l@hvar.v9wlupn.mongodb.net/task-manager'

mongoose.connect(connectionURL)
    .catch((error) => console.log(error))

module.exports = mongoose