import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsCharts() {
    const [filter, setFilter] = useState('day');
    const [loginData, setLoginData] = useState([]);
    const [clickData, setClickData] = useState({ stats: [], topLinks: [] });
    const [taskData, setTaskData] = useState({ added: [], completed: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, [filter]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [logins, clicks, tasks] = await Promise.all([
                axios.get(`/api/admin/analytics/logins?filter=${filter}`),
                axios.get(`/api/admin/analytics/clicks?filter=${filter}`),
                axios.get(`/api/admin/analytics/tasks?filter=${filter}`)
            ]);
            setLoginData(logins.data);
            setClickData(clicks.data);
            setTaskData(tasks.data);
        } catch (error) {
            console.error('Failed to fetch analytics data', error);
        } finally {
            setLoading(false);
        }
    };

    // Merge task data for the chart
    const mergedTaskData = (taskData?.added || []).map(a => {
        const c = (taskData?.completed || []).find(comp => comp.label === a.label);
        return {
            label: a.label,
            added: a.count,
            completed: c ? c.count : 0
        };
    });

    if (loading && !loginData.length) return <div className="analytics-loading">Loading analytics...</div>;

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h2 className="section-title">System Analytics</h2>
                <div className="filter-buttons">
                    {['day', 'week', 'month'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="analytics-grid">
                {/* Login Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">User Logins</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={loginData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                <XAxis dataKey="label" stroke="#a0aec0" />
                                <YAxis stroke="#a0aec0" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#d4af37' }}
                                />
                                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Tasks (Added vs Completed)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mergedTaskData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                <XAxis dataKey="label" stroke="#a0aec0" />
                                <YAxis stroke="#a0aec0" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="added" stroke="#d4af37" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="completed" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Click Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Link Clicks Overview</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={clickData.stats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                <XAxis dataKey="label" stroke="#a0aec0" />
                                <YAxis stroke="#a0aec0" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#4a90e2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Links */}
                <div className="chart-card">
                    <h3 className="chart-title">Most Clicked Links</h3>
                    <div className="top-links-list">
                        {clickData.topLinks.length === 0 ? (
                            <p className="no-data">No click data available</p>
                        ) : (
                            <table className="mini-table">
                                <thead>
                                    <tr>
                                        <th>Link Text</th>
                                        <th>URL</th>
                                        <th className="text-right">Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clickData.topLinks.map((link, idx) => (
                                        <tr key={idx}>
                                            <td>{link.text || 'N/A'}</td>
                                            <td className="truncate-cell">{link.url}</td>
                                            <td className="text-right fw-bold">{link.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .analytics-container { margin-top: 2rem; }
                .analytics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .section-title { font-size: 1.5rem; color: #fff; margin: 0; }
                .filter-buttons { display: flex; gap: 0.5rem; }
                .filter-btn {
                    padding: 0.4rem 1rem;
                    background: #2d3748;
                    border: 1px solid #4a5568;
                    color: #a0aec0;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .filter-btn.active { background: #d4af37; color: #1a202c; border-color: #d4af37; font-weight: 600; }
                .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .chart-card {
                    background: #1a202c;
                    border: 1px solid #2d3748;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .chart-title { font-size: 1.1rem; color: #a0aec0; margin-bottom: 1.5rem; }
                .chart-wrapper { height: 300px; }
                .top-links-list { height: 300px; overflow-y: auto; }
                .mini-table { width: 100%; border-collapse: collapse; color: #cbd5e0; font-size: 0.9rem; }
                .mini-table th { text-align: left; padding: 0.5rem; border-bottom: 1px solid #2d3748; color: #718096; }
                .mini-table td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #2d3748; }
                .truncate-cell { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .fw-bold { font-weight: 700; color: #d4af37; }
                .no-data { text-align: center; color: #718096; margin-top: 4rem; }
                .analytics-loading { color: #fff; text-align: center; padding: 4rem; }
                @media (max-width: 1024px) { .analytics-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
