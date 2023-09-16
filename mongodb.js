const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


const connectionURL = 'mongodb+srv://alexbradau:d34dp00l@hvar.v9wlupn.mongodb.net/'
const databaseName = 'task-manager'

const client = new MongoClient(connectionURL);

async function run() {

    try {

        await client.connect();

        const db = client.db(databaseName)

        const users = await db.collection('users').insertMany([
            {
                name: 'Sosa',
                age: '300'
            },
            {
                name: 'Sandman',
                age: '28'
            }
        ])

        const tasks = await db.collection('tasks').insertMany([
            {
                description: 'Finish node course',
                completed: false
            },
            {
                description: 'Smoke a spliff',
                completed: true
            },
            {
                description: 'Get a lineup',
                completed: true
            }
        ])


        console.log(users)
        console.log(tasks)

    } finally {

        await client.close();

    }

}

run().catch(console.dir);