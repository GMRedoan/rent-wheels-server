const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

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
        // await client.connect()

        const dataBase = client.db('rentWheels_db')
        const carsCollection = dataBase.collection('cars')
        const newCarCollection = dataBase.collection('newCars')
        const usersCollection = dataBase.collection('users')
        const bookCollection = dataBase.collection('books')

        // all cars api & individual api by email
        app.get('/cars', async (req, res) => {
            const providerEmail = req.query.providerEmail
            let query = {}
            if (providerEmail) {
                query = { providerEmail: providerEmail }
            }
            const cursor = carsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
            const result = await carsCollection.findOne(query)
            res.send(result)
        })

        app.post('/cars', async (req, res) => {
            const newCar = req.body
            const result = await carsCollection.insertOne(newCar)
            res.send(result)
        })

        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
            const result = await carsCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/cars/:id', async (req, res) => {
            const id = req.params.id
            const updatedCar = req.body
            const query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
            const update = {
                $set: updatedCar
            }
            const result = await carsCollection.updateOne(query, update)
            res.send(result)
        })


        // booking api
        app.get('/books', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = { email: email }
            }
            const cursor = bookCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/books', async (req, res) => {
            const newBooking = req.body
            const result = await bookCollection.insertOne(newBooking)
            res.send(result)
        })

        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id
            const query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
            const result = await bookCollection.deleteOne(query)
            res.send(result)
        })

        // new cars api
        app.get('/newCars', async (req, res) => {
            const cursor = newCarCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // users api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/role/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // update the user information
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id
            const updatedUser = req.body
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: updatedUser
            }
            const result = await usersCollection.updateOne(query, update)
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const newUser = req.body
            const email = req.body.email
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                res.send({ message: 'already added this user in database' })
            }
            else {
                const result = await usersCollection.insertOne(newUser)
                res.send(result)
            }
        })

        // update user info
        app.patch('/role/:email', async (req, res) => {
            const email = req.params.email;
            const updatedData = req.body;
            const result = await usersCollection.updateOne(
                { email },
                { $set: updatedData }
            );
            res.send(result);
        });


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`rent wheels server is running on port : ${port}`)
})