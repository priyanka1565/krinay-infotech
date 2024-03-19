

import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Container, Card,Box, Grid, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ text: '', description: '' });
    const [editTodo, setEditTodo] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios.get('http://localhost:3000/api/todos')
            .then(res => {
                setTodos(res.data);
            })
            .catch(err => {
                console.error('Error fetching todos:', err);
            });
    };

    const handleAddTodo = () => {
        axios.post('http://localhost:3000/api/todos', newTodo)
            .then(res => {
                setTodos([...todos, res.data]);
                setNewTodo({ text: '', description: '' });
            })
            .catch(err => {
                console.error('Error adding todo:', err);
            });
    };


    const handleToggleTodo = (id) => {
        axios.put(`http://localhost:3000/api/todos/${id}`, { completed: !todos.find(todo => todo._id === id).completed })
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

    const handleEditTodo = (id) => {
        const editedTodo = todos.find(todo => todo._id === id);
        setEditTodo(editedTodo);
    };
    const saveEditedTodo = () => {
        axios.put(`http://localhost:3000/api/todos/${editTodo._id}`, editTodo)
            .then(() => {
                fetchTodos(); // Refresh the TODO list after editing
                setEditTodo(null); // Clear the edit mode
            })
            .catch(err => {
                console.error('Error editing todo:', err);
            });
    };
    const handleDeleteTodo = (id) => {
        axios.delete(`http://localhost:3000/api/todos/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => {
                console.error('Error deleting todo:', err);
            });
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                My TODO List
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Add new todo"
                        fullWidth
                        value={newTodo.text}
                        onChange={(e) => setNewTodo(prevState => ({ ...prevState, text: e.target.value }))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTodo();
                            }
                        }}
                        sx={{ borderRadius: '8px' }}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newTodo.description}
                        onChange={(e) => setNewTodo(prevState => ({ ...prevState, description: e.target.value }))}
                        multiline
                        rows={4}
                        sx={{ mt: 2, borderRadius: '8px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTodo}
                        fullWidth
                        sx={{ mt: 2, borderRadius: '8px', boxShadow: 'none' }}
                    >
                        Add
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <List>
                        {todos.map(todo => (
                            <Card key={todo._id} variant="outlined" sx={{ mb: 2, bgcolor: todo.completed ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <ListItem disablePadding>
                                        <Checkbox
                                            checked={todo.completed}
                                            onChange={(e) => handleToggleTodo(todo._id, e.target.checked)}
                                            sx={{ color: todo.completed ? 'green' : 'red' }}
                                        />
                                        {editTodo && editTodo._id === todo._id ? (
                                            <>
                                                <TextField
                                                    value={editTodo.text}
                                                    onChange={(e) => setEditTodo(prevState => ({ ...prevState, text: e.target.value }))}
                                                    fullWidth
                                                    autoFocus
                                                    sx={{ mr: 1 }}
                                                />
                                                <TextField
                                                    value={editTodo.description}
                                                    onChange={(e) => setEditTodo(prevState => ({ ...prevState, description: e.target.value }))}
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                />
                                                <Button variant="contained" color="primary" onClick={saveEditedTodo}>Save</Button>
                                            </>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={todo.text}
                                                    secondary={todo.description}
                                                    primaryTypographyProps={{ variant: 'subtitle1', sx: { fontWeight: 'bold', color: 'black' } }}
                                                    secondaryTypographyProps={{ variant: 'body2', sx: { color: 'black' } }}
                                                />
                                                <ListItemSecondaryAction>
                                                    <Box mr={1}>
                                                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditTodo(todo._id)}>
                                                            <EditIcon sx={{ color: 'green' }} />
                                                        </IconButton>
                                                    </Box>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo._id)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </>
                                        )}
                                    </ListItem>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Container>






    );
}

export default App;
