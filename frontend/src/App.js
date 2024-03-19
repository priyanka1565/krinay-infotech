// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios.get('http://localhost:5000/api/todos')
            .then(res => {
                setTodos(res.data);
            })
            .catch(err => {
                console.error('Error fetching todos:', err);
            });
    };

    const handleAddTodo = () => {
        axios.post('http://localhost:5000/api/todos', { title: newTodo })
            .then(res => {
                setTodos([...todos, res.data]);
                setNewTodo('');
            })
            .catch(err => {
                console.error('Error adding todo:', err);
            });
    };

    const handleToggleTodo = (id) => {
        axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !todos.find(todo => todo._id === id).completed })
            .then(() => {
                setTodos(todos.map(todo => {
                    if (todo._id === id) {
                        todo.completed = !todo.completed;
                    }
                    return todo;
                }));
            })
            .catch(err => {
                console.error('Error toggling todo:', err);
            });
    };

    const handleDeleteTodo = (id) => {
        axios.delete(`http://localhost:5000/api/todos/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => {
                console.error('Error deleting todo:', err);
            });
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                TODO List
            </Typography>
            <TextField
                label="Add new todo"
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddTodo();
                    }
                }}
            />
            <Button variant="contained" color="primary" onClick={handleAddTodo} fullWidth sx={{ mt: 2 }}>
                Add
            </Button>
            <List sx={{ mt: 2 }}>
                {todos.map(todo => (
                    <ListItem key={todo._id} disablePadding>
                        <Checkbox
                            edge="start"
                            checked={todo.completed}
                            tabIndex={-1}
                            disableRipple
                            onChange={() => handleToggleTodo(todo._id)}
                        />
                        <ListItemText primary={todo.title} secondary={todo.description} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default App;
