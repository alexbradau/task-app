const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const connectionURL = 'mongodb+srv://alexbradau:d34dp00l@hvar.v9wlupn.mongodb.net/'
    const databaseName = 'task-manager'

    const client = new MongoClient(connectionURL);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        const db = client.db(databaseName)
        db.collection('users').insertOne({
            name: 'Alex',
            age: '27'
        })

    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);