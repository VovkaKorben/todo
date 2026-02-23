const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())



const mongoose = require('mongoose')
//const mongoDB = 'mongodb://127.0.0.1:27017/todoapp'
const mongoDB = 'mongodb+srv://test:test@skynet.plmo5hs.mongodb.net/todoapp?appName=Skynet'

mongoose.connect(mongoDB)
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Database test connected")
})

// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }
})

// model
const Todo = mongoose.model('Todo', todoSchema, 'todos')


function checkTodoIsOk(todoText) {
    return todoText.trim() !== '';


}

// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})



app.post('/todos', async (request, response) => {
    const { text } = request.body
    if (!checkTodoIsOk(text))
        return response.status(400).json({ error: 'Todo is empty!' });
    const todo = new Todo({
        text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)
})

app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})
app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

app.delete('/todos/:id', async (request, response) => {
    const doc = await Todo.findById(request.params.id);
    if (doc) {
        await doc.deleteOne()
        response.json(doc)
    }
    else response.status(404).end()
})

// Put-reitti lisätty, osa 2
app.put('/todos/:id', async (request, response) => {
    // Haetaan päivityspyynnön runko (request.body), jossa on uusi tehtäväteksti
    const { text } = request.body;
    if (!checkTodoIsOk(text))
        return response.status(400).json({ error: 'Todo is empty!' });
    // Luodaan päivitettävä tehtäväobjekti
    const todo = {
        text: text
    };

    // Etsitään tehtävä tietokannasta ID:n perusteella ja päivitetään sen tiedot
    const filter = { _id: request.params.id }; // Hae tehtävä ID:llä
    const updatedTodo = await Todo.findOneAndUpdate(filter, todo, {
        returnDocument: 'after'
    });

    // Palautetaan päivitetty tehtävä vastauksena
    response.json(updatedTodo);
});
