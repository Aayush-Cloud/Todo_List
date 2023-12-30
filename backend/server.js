// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 80;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    return res.status(200).send(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
    completed: false
  });
  try {
    const savedTodo = await todo.save();
    return res.status(200).send(savedTodo);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.send(updatedTodo);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    const response = {
      message: "Todo successfully deleted",
      id: deletedTodo._id
    };
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
