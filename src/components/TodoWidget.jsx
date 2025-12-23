import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            setTasks(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim() || !projectName.trim()) return;

        try {
            const response = await axios.post('/tasks', {
                title,
                project_name: projectName
            });
            setTasks([response.data, ...tasks]);
            setTitle('');
            setProjectName('');
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const toggleTask = async (task) => {
        try {
            const response = await axios.put(`/tasks/${task.id}`, {
                is_completed: !task.is_completed
            });
            setTasks(tasks.map(t => t.id === task.id ? response.data : t));
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <div className="todo-widget team-card">
            <h3 className="card-title">
                <i className="fas fa-tasks"></i>
                My Todo List
            </h3>

            <form onSubmit={addTask} className="todo-add-form">
                <input
                    type="text"
                    placeholder="Project Name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="todo-input project-input"
                />
                <div className="todo-input-group">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="todo-input"
                    />
                    <button type="submit" className="todo-add-btn">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </form>

            <div className="todo-list scrollable-todo">
                {loading ? (
                    <div className="todo-empty">Loading tasks...</div>
                ) : !Array.isArray(tasks) || tasks.length === 0 ? (
                    <div className="todo-empty">No tasks yet. Start by adding one!</div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className={`todo-item ${task.is_completed ? 'completed' : ''}`}>
                            <div className="todo-checkbox" onClick={() => toggleTask(task)}>
                                <i className={`${task.is_completed ? 'fas fa-check-circle' : 'far fa-circle'}`}></i>
                            </div>
                            <div className="todo-content">
                                <div className="todo-project">{task.project_name}</div>
                                <div className="todo-title">{task.title}</div>
                            </div>
                            <button className="todo-delete" onClick={() => deleteTask(task.id)}>
                                <i className="far fa-trash-alt"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoWidget;
