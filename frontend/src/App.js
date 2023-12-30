// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:80/api/todos')
      .then(res => {
        setTodos(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:80/api/todos', { task })
      .then(res => {
        setTodos([...todos, res.data]);
        setTask('');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:80/api/todos/${id}`)
      .then(res => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = (id, task) => {
    axios.put(`http://localhost:80/api/todos/${id}`, { task })
      .then(res => {
        setTodos(todos.map(todo => {
          if (todo._id === id) {
            todo.task = task;
          }
          return todo;
        }));
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {todo.task}
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
            <button onClick={() => handleUpdate(todo._id, prompt('Enter new task:'))}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
