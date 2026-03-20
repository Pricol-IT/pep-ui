import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

export default function CompanyLocationManager() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('companies');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'companies', label: 'Companies' },
        { id: 'locations', label: 'Locations' },
        { id: 'branches', label: 'Branches' },
        { id: 'plants', label: 'Plants' },
        { id: 'divisions', label: 'Divisions' },
        { id: 'departments', label: 'Departments' },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/admin/${activeTab}`);
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!window.confirm('Are you sure you want to refresh details from the master database? This may take a few moments.')) return;
        
        setSyncing(true);
        setError(null);
        try {
            const res = await axios.post('/admin/sync');
            alert(res.data.message || 'Sync completed successfully');
            fetchData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header-row">
                <h1 className="admin-header">Company & Location Management</h1>
                <button 
                    className="btn-primary" 
                    onClick={handleSync}
                    disabled={syncing}
                    style={{ background: syncing ? '#475569' : '#d4af37' }}
                >
                    <i className={`fas ${syncing ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
                    {syncing ? 'Syncing...' : 'Refresh from DB'}
                </button>
            </div>

            <div className="admin-tabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="admin-table-card">
                {error && <div className="error-message" style={{ padding: '1rem', color: '#ef4444' }}>{error}</div>}
                
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading {activeTab}...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {activeTab === 'companies' && <th>Short Name</th>}
                                    {activeTab === 'locations' && <th>Company</th>}
                                    <th>External ID</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No {activeTab} found. Click "Refresh from DB" to sync.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            {activeTab === 'companies' && <td>{item.short_name}</td>}
                                            {activeTab === 'locations' && <td>{item.company?.name || 'N/A'}</td>}
                                            <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.external_id || 'LOCAL'}</td>
                                            <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .admin-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .admin-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1px;
                }
                .admin-tab {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    padding: 0.75rem 1.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .admin-tab.active {
                    color: #fff;
                    border-bottom-color: #d4af37;
                }
                .admin-tab:hover {
                    color: #cbd5e1;
                }
                .btn-primary {
                    background: #d4af37;
                    color: #0f172a;
                    border: none;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .btn-primary:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .btn-primary:disabled {
                    cursor: not-allowed;
                }
                .admin-table-container {
                    overflow-x: auto;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .admin-table th {
                    text-align: left;
                    padding: 1rem;
                    color: #94a3b8;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .admin-table td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    color: #e2e8f0;
                }
                .admin-table tr:hover td {
                    background: rgba(255,255,255,0.02);
                }
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border-radius: 6px;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}
