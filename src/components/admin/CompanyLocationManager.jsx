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
    const [showModal, setShowModal] = useState(false);
    const [syncStatus, setSyncStatus] = useState({
        status: 'idle',
        percentage: 0,
        logs: []
    });

    const tabs = [
        { id: 'organization', label: 'Organization Tree' },
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

    useEffect(() => {
        if (showModal) {
            const el = document.getElementById('sync-log-end');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [syncStatus.logs, showModal]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = activeTab === 'organization' ? '/admin/organization' : `/admin/${activeTab}`;
            const res = await axios.get(endpoint);
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const pollStatus = async () => {
        try {
            const res = await axios.get('/admin/sync-status');
            setSyncStatus(res.data);
            if (res.data.status === 'completed' || res.data.status === 'failed') {
                return true; // Stop polling
            }
        } catch (err) {
            console.error('Polling failed:', err);
        }
        return false;
    };

    const handleSync = async () => {
        if (!window.confirm('Are you sure you want to refresh details from the master database? This may take a few moments.')) return;
        
        setSyncing(true);
        setShowModal(true);
        setSyncStatus({ status: 'running', percentage: 0, logs: [] });
        setError(null);

        // Start polling
        const pollInterval = setInterval(async () => {
            const shouldStop = await pollStatus();
            if (shouldStop) clearInterval(pollInterval);
        }, 1000);

        try {
            await axios.post('/admin/sync');
            fetchData();
        } catch (err) {
            console.error(err);
            // Error is handled by polling and stored in syncStatus
        } finally {
            setSyncing(false);
            clearInterval(pollInterval);
            // Final poll to get completion state
            pollStatus();
        }
    };

    const getChildType = (parentType) => {
        const map = {
            'COMPANY': 'BRANCH',
            'BRANCH': 'PLANT',
            'PLANT': 'LOCATION',
            'LOCATION': 'DIVISION',
            'DIVISION': 'DEPARTMENT'
        };
        return map[parentType] || 'UNKNOWN';
    };

    const TreeNode = ({ item, level = 0, type = 'COMPANY' }) => {
        const [isOpen, setIsOpen] = useState(level < 1); // Expand first level by default
        
        // Determine children based on type and relationships
        let children = [];
        if (type === 'COMPANY') children = item.branches || [];
        else if (type === 'BRANCH') children = item.plants || [];
        else if (type === 'PLANT') children = item.locations || [];
        else if (type === 'LOCATION') children = item.divisions || [];
        else if (type === 'DIVISION') children = item.departments || [];

        const hasChildren = children.length > 0;

        return (
            <div className={`tree-node level-${level} ${hasChildren ? 'has-children' : ''}`}>
                <div className={`node-content ${isOpen ? 'open' : ''}`} onClick={() => hasChildren && setIsOpen(!isOpen)}>
                    {hasChildren && (
                        <span className="expand-icon">
                            {isOpen ? <i className="far fa-minus-square"></i> : <i className="far fa-plus-square"></i>}
                        </span>
                    )}
                    {!hasChildren && <span className="node-dot">•</span>}
                    <span className="node-name">{item.name}</span>
                    <span className={`node-badge badge-${type.toLowerCase()}`}>{type}</span>
                    {hasChildren && <span className="child-count">{children.length} {getChildType(type)}s</span>}
                </div>
                {isOpen && hasChildren && (
                    <div className="node-children">
                        {children.map((child, idx) => (
                            <TreeNode 
                                key={child.id || `child-${idx}`} 
                                item={child} 
                                level={level + 1} 
                                type={getChildType(type)} 
                            />
                        ))}
                    </div>
                )}
            </div>
        );
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
                ) : activeTab === 'organization' ? (
                    <div className="organization-tree-container">
                        {data.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                No hierarchy data found. Click "Refresh from DB" to generate.
                            </div>
                        ) : (
                            <div className="tree-root">
                                {data.map(company => (
                                    <TreeNode key={company.id} item={company} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {activeTab === 'companies' && <th>Short Name</th>}
                                    {activeTab === 'branches' && <th>Company</th>}
                                    {activeTab === 'plants' && <th>Branch</th>}
                                    {activeTab === 'locations' && <th>Plant</th>}
                                    {activeTab === 'divisions' && <th>Location</th>}
                                    {activeTab === 'departments' && <th>Division</th>}
                                    <th>External ID</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No {activeTab} found. Click "Refresh from DB" to sync.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            {activeTab === 'companies' && <td>{item.short_name}</td>}
                                            {activeTab === 'branches' && <td>{item.company?.name || 'N/A'}</td>}
                                            {activeTab === 'plants' && <td>{item.branch?.name || 'N/A'}</td>}
                                            {activeTab === 'locations' && <td>{item.plant?.name || 'N/A'}</td>}
                                            {activeTab === 'divisions' && <td>{item.location?.name || 'N/A'}</td>}
                                            {activeTab === 'departments' && <td>{item.division?.name || 'N/A'}</td>}
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

            {showModal && (
                <div className="sync-modal-overlay">
                    <div className="sync-modal-content">
                        <div className="sync-modal-header">
                            <h2>Database Synchronization</h2>
                            {(syncStatus.status === 'completed' || syncStatus.status === 'failed') && (
                                <button className="sync-close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            )}
                        </div>
                        <div className="sync-modal-body">
                            <div className="sync-progress-bar-bg">
                                <div 
                                    className={`sync-progress-bar-fill ${syncStatus.status}`} 
                                    style={{ width: `${syncStatus.percentage}%` }}
                                ></div>
                            </div>
                            <div className="sync-status-indicator">
                                <span className={`status-dot ${syncStatus.status}`}></span>
                                {syncStatus.status === 'running' ? `Processing... ${syncStatus.percentage}%` : syncStatus.status.toUpperCase()}
                            </div>
                            <div className="sync-log-container">
                                {syncStatus.logs.map((log, index) => (
                                    <div key={index} className="sync-log-line">
                                        <span className="log-timestamp">{log.time}</span>
                                        <span className="log-msg">{log.message}</span>
                                    </div>
                                ))}
                                <div id="sync-log-end"></div>
                            </div>
                        </div>
                        <div className="sync-modal-footer">
                            {syncStatus.status === 'completed' && <span className="success-txt">✓ Sync Successful</span>}
                            {syncStatus.status === 'failed' && <span className="error-txt">✗ Sync Failed</span>}
                            {syncStatus.status === 'running' && <span className="running-txt">Please wait, do not close this window...</span>}
                            {(syncStatus.status === 'completed' || syncStatus.status === 'failed') && (
                                <button className="btn-primary" onClick={() => setShowModal(false)}>Close</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

                /* Organization Tree Styles */
                .organization-tree-container {
                    padding: 1.5rem;
                }
                .tree-root {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .tree-node {
                    position: relative;
                }
                .node-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    user-select: none;
                }
                .node-content:hover {
                    background: rgba(30, 41, 59, 1);
                    border-color: rgba(212, 175, 55, 0.3);
                    transform: translateX(4px);
                }
                .node-content.open {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    background: rgba(30, 41, 59, 0.8);
                }
                .expand-icon {
                    color: #d4af37;
                    font-size: 1.1rem;
                    width: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .node-dot {
                    color: #64748b;
                    font-size: 1.5rem;
                    width: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 0;
                }
                .node-name {
                    font-weight: 600;
                    color: #f1f5f9;
                    font-size: 0.95rem;
                }
                .node-badge {
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 0.05em;
                }
                .badge-company { background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
                .badge-location { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
                .badge-branch { background: rgba(6, 182, 212, 0.2); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }
                .badge-plant { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
                .badge-division { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
                .badge-department { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); }

                .child-count {
                    color: #64748b;
                    font-size: 0.8rem;
                    font-style: italic;
                    margin-left: auto;
                }
                .node-children {
                    margin-left: 1.5rem;
                    padding-top: 0.5rem;
                    padding-left: 1.5rem;
                    border-left: 2px dashed rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    animation: slideDown 0.2s ease-out;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .tree-node.level-0 > .node-content {
                    background: rgba(99, 102, 241, 0.05);
                    border-left: 4px solid #6366f1;
                    padding: 1rem;
                }
                .tree-node.level-0 > .node-content .node-name {
                    font-size: 1.1rem;
                }

                /* Sync Modal Styles */
                .sync-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .sync-modal-content {
                    background: #1e293b;
                    width: 100%;
                    max-width: 600px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    animation: modalIn 0.3s ease-out;
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .sync-modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .sync-modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #f8fafc;
                }
                .sync-close-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .sync-modal-body {
                    padding: 1.5rem;
                }
                .sync-progress-bar-bg {
                    height: 8px;
                    background: #334155;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                .sync-progress-bar-fill {
                    height: 100%;
                    width: 0;
                    transition: width 0.4s ease-out;
                    background: #d4af37;
                }
                .sync-progress-bar-fill.running {
                    background: linear-gradient(90deg, #d4af37, #f59e0b);
                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                }
                .sync-progress-bar-fill.completed { background: #10b981; }
                .sync-progress-bar-fill.failed { background: #ef4444; }

                .sync-status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #cbd5e1;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .status-dot.running { background: #d4af37; animation: pulse 1.5s infinite; }
                .status-dot.completed { background: #10b981; }
                .status-dot.failed { background: #ef4444; }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                .sync-log-container {
                    background: #0f172a;
                    height: 200px;
                    border-radius: 6px;
                    padding: 1rem;
                    overflow-y: auto;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 0.85rem;
                }
                .sync-log-line {
                    margin-bottom: 0.5rem;
                    display: flex;
                    gap: 1rem;
                }
                .log-timestamp { color: #64748b; min-width: 65px; }
                .log-msg { color: #e2e8f0; }

                .sync-modal-footer {
                    padding: 1.25rem 1.5rem;
                    background: rgba(255,255,255,0.02);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .success-txt { color: #10b981; font-weight: 600; }
                .error-txt { color: #ef4444; font-weight: 600; }
                .running-txt { color: #94a3b8; font-size: 0.9rem; }
            `}</style>
        </div>
    );
}
