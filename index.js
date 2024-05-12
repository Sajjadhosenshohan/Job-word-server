const express = require('express')
const cors = require('cors')
require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 8000
const app = express()

const corsOptions = {
    origin: [
        // 'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
// middleware
app.use(cors(corsOptions))
app.use(express.json())
// app.use(cookieParser())
// yulo4fhTZ6Q2DSuQ
// JobWord


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejfr6xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const assignmentCollection = client.db('JobWord').collection('allAssignment')
        // get assignment from create user
        app.post('/assignment', async (req, res) => {
            const assignment = req.body

            const result = await assignmentCollection.insertOne(assignment)
            res.send(result)
        })

        // get all assignment 
        app.get('/allAssignment', async (req, res) => {
            const result = await assignmentCollection.find().toArray()
            res.send(result)
        })


        // delete one item
        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query)
            res.send(result)
        })

        // get by id
        app.get('/updateData/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query)
            res.send(result)
        })
        // update a job in db
        app.put('/myUpdate/:id', async (req, res) => {
            const id = req.params.id
            const updateData = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {

                    assignment_title: updateData.assignment_title,
                    assignment_level: updateData.assignment_level,
                    marks: updateData.marks,
                    description: updateData.description,
                    due_date: updateData.due_date,
                    thumbnail: updateData.thumbnail,
                },
            }
            const result = await assignmentCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('JobWord is running....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))