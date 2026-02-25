import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const AVATAR_COLORS = ['avatar-blue', 'avatar-purple', 'avatar-green']

function getInitials(name) {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase()
}

function formatSalary(salary) {
    const num = parseFloat(salary)
    if (isNaN(num)) return salary
    return '₹ ' + num.toLocaleString('en-IN')
}

export default function ListPage() {
    const { employees } = useAuth()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState('')
    const [sortDir, setSortDir] = useState('asc')

    const filtered = useMemo(() => {
        let list = [...employees]
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(e =>
                Object.values(e).some(v => String(v).toLowerCase().includes(q))
            )
        }
        if (sortKey) {
            list.sort((a, b) => {
                const va = String(a[sortKey] ?? '').toLowerCase()
                const vb = String(b[sortKey] ?? '').toLowerCase()
                return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
            })
        }
        return list
    }, [employees, search, sortKey, sortDir])

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
    }

    const sortIcon = (key) => key !== sortKey ? ' ⇅' : sortDir === 'asc' ? ' ↑' : ' ↓'

    const keys = employees.length > 0 ? Object.keys(employees[0]) : []
    const nameKey = keys.find(k => /name/i.test(k)) || keys[0]
    const idKey = keys.find(k => /id/i.test(k)) || keys[0]
    const cityKey = keys.find(k => /city|location/i.test(k))
    const deptKey = keys.find(k => /dept|department/i.test(k))
    const salKey = keys.find(k => /sal|salary|pay/i.test(k))
    const dispKeys = [nameKey, cityKey, deptKey, salKey].filter(Boolean)

    const totalSal = employees.reduce((s, e) => s + (parseFloat(e[salKey]) || 0), 0)
    const cities = new Set(employees.map(e => e[cityKey])).size

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content animate-in">
                <div className="page-header">
                    <h1>Employee Directory</h1>
                    <p>Browse, search and manage all employee records</p>
                </div>


                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">{employees.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Cities</div>
                        <div className="stat-value">{cities}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Payroll</div>
                        <div className="stat-value">₹{(totalSal / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Avg. Salary</div>
                        <div className="stat-value">
                            {employees.length > 0
                                ? '₹' + Math.round(totalSal / employees.length).toLocaleString('en-IN')
                                : '—'}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-bar">
                        <span className="search-icon">↳</span>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search employees…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <Link to="/bar-graph" className="btn btn-primary btn-sm">Analytics</Link>
                        <Link to="/map" className="btn btn-ghost btn-sm">Map view</Link>
                    </div>
                </div>

                {/* Table */}
                {employees.length === 0 ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>No employee data found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {dispKeys.map(k => (
                                        <th key={k} onClick={() => handleSort(k)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                            {k.charAt(0).toUpperCase() + k.slice(1)}{sortIcon(k)}
                                        </th>
                                    ))}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((emp, i) => (
                                    <tr key={emp[idKey] || i} onClick={() => navigate(`/details/${emp[idKey] || i}`)}>
                                        <td><span className="badge badge-gray">{i + 1}</span></td>
                                        {dispKeys.map((k, ki) => (
                                            <td key={k}>
                                                {ki === 0 ? (
                                                    <div className="employee-cell">
                                                        <div className={`avatar ${AVATAR_COLORS[i % 3]}`}>{getInitials(emp[k])}</div>
                                                        <div>
                                                            <div className="employee-name">{emp[k]}</div>
                                                            <div className="employee-id">ID: {emp[idKey]}</div>
                                                        </div>
                                                    </div>
                                                ) : k === salKey ? (
                                                    <span className="badge badge-green">{formatSalary(emp[k])}</span>
                                                ) : (
                                                    emp[k] || '—'
                                                )}
                                            </td>
                                        ))}
                                        <td>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={ev => { ev.stopPropagation(); navigate(`/details/${emp[idKey] || i}`) }}
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Showing {filtered.length} of {employees.length} records
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
