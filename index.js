const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewear
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faflb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('connected');

async function run() {
    try {
        await client.connect();
        const volunterCollection = client.db('VolunteerData').collection('Data')


        // sb data pawa .
        app.get('/data', async (req, res) => {
            const query = {}
            const cursor = volunterCollection.find(query)
            const service = await cursor.toArray()
            res.json(service)
        });

        // id diye single data pawa .
        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await volunterCollection.findOne(query)
            res.send(service);
        });

        // post/add kora 
        app.post('/data', async (req, res) => {
            const newData = req.body
            const result = await volunterCollection.insertOne(newData)
            res.send(result)
        });

        // delete kora
        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await volunterCollection.deleteOne(query)
            res.send(service)
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('yes i can do it')
})

app.listen(port, () => {
    console.log('listenig  to port', port);
})