import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await axios.get('/tasks');
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setTasks([]);
            setLoading(false);
        }
    }, [user, fetchTasks]);

    const value = {
        tasks,
        loading,
        refreshTasks: fetchTasks,
        // Helper to update locally for optimistic UI if needed, 
        // but currently we refetch to maintain filtering logic correctly.
        setTasks 
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
