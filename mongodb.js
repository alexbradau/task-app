const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


const connectionURL = 'mongodb+srv://alexbradau:d34dp00l@hvar.v9wlupn.mongodb.net/'
const databaseName = 'task-manager'

const client = new MongoClient(connectionURL);

async function run() {

    try {

        await client.connect();

        const db = client.db(databaseName)
        const result = await db.collection('users').insertOne({
            name: 'Alex',
            age: '27'
        })

        console.log(
            `Document was inserted with the _id: ${result.insertedId}`,
        );

    } finally {

        await client.close();

    }

}

run().catch(console.dir);