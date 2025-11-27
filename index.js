const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fsw2asc.mongodb.net/?appName=Cluster0`;
 

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('rent wheels is now running')
})

async function run() {
    try {
        await client.connect()

        const dataBase = client.db('rentWheels_db')
        const carsCollection = dataBase.collection('cars')

        app.get('/cars', async(req, res) => {
            const cursor = carsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/cars/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await carsCollection.findOne(query)
            res.send(result)
        })

        app.post('/cars', async(req, res) => {
            const newCar = req.body
            const result = await carsCollection.insertOne(newCar)
            res.send(result)
        })

        app.patch('/cars/:id', async(req, res) => {
            const id = req.params.id
            const updatedCar = req.body
            const query = {_id: new ObjectId(id)}
            const update = {
                $set: {
                    car: updatedCar.car,
                    price: updatedCar.price
                }
            }
            const result = await carsCollection.updateOne(query, update)
            res.send(result)
        })

        app.delete('/cars/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await carsCollection.deleteOne(query)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`rent wheels server is running on port : ${port}`)
})