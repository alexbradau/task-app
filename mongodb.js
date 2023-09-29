const {MongoClient, ObjectId} = require('mongodb')

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

async function get() {

    try {

        await client.connect();

        const db = client.db(databaseName)

        const tasks = await db.collection('tasks').find({completed:true})


        //console.log(users)
        for await (const doc of tasks) {

            console.dir(doc.description);
      
        }
    } finally {

        await client.close();

    }

}

async function update() {

    try{
        await client.connect()
        const db = client.db(databaseName)
        const updatePromise = db.collection('users').updateOne({
            _id: new ObjectId('65061a4b2b5c933bf1537af9')
        },{
            $set: {
                name: 'Sosa'
            }
    })
        await updatePromise.then((result) => {
            console.log(result)
        }).catch((error) => 
            console.log(error)
     )

    } finally{
        await client.close()
    }
}

update()
//run().catch(console.dir);
//get().catch(console.dir);