import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList
} from 'recharts'

const COLORS = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa',
    '#60a5fa', '#818cf8', '#7c3aed', '#4f46e5',
    '#2563eb', '#4338ca'
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 14px',
            }}>
                <p style={{ color: '#71717a', fontSize: '0.72rem', marginBottom: 2 }}>Employee</p>
                <p style={{ fontWeight: 600, color: '#f5f5f5', marginBottom: 6 }}>{label}</p>
                <p style={{ color: '#86efac', fontWeight: 600, fontSize: '0.9rem' }}>
                    ₹ {Number(payload[0].value).toLocaleString('en-IN')}
                </p>
            </div>
        )
    }
    return null
}

export default function BarGraphPage() {
    const { employees } = useAuth()

    const keys = employees.length > 0 ? Object.keys(employees[0]) : []
    const nameKey = keys.find(k => /name/i.test(k)) || keys[0]
    const salKey = keys.find(k => /sal|salary|pay/i.test(k))

    const chartData = employees.slice(0, 10).map(e => ({
        name: (e[nameKey] || '').split(' ')[0],
        fullName: e[nameKey] || '—',
        salary: parseFloat(e[salKey]) || 0,
    }))

    const maxSal = Math.max(...chartData.map(d => d.salary))
    const minSal = Math.min(...chartData.map(d => d.salary))
    const avgSal = chartData.length > 0 ? Math.round(chartData.reduce((s, d) => s + d.salary, 0) / chartData.length) : 0

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content animate-in">
                <div className="breadcrumb">
                    <Link to="/list">Directory</Link>
                    <span>›</span>
                    <span>Analytics</span>
                </div>

                <div className="page-header">
                    <h1>Salary Analytics</h1>
                    <p>Salary comparison across the first 10 employees</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                    <div className="stat-card">
                        <div className="stat-label">Highest Salary</div>
                        <div className="stat-value">₹{maxSal.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Lowest Salary</div>
                        <div className="stat-value">₹{minSal.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Average Salary</div>
                        <div className="stat-value">₹{avgSal.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div className="chart-wrapper glass-card">
                    <h2 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 24, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Salary Distribution (₹)
                    </h2>
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'Inter' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                                tickLine={false}
                                angle={-35}
                                textAnchor="end"
                                interval={0}
                            />
                            <YAxis
                                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'Inter' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="salary" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.9} />
                                ))}
                                <LabelList
                                    dataKey="salary"
                                    position="top"
                                    formatter={v => '₹' + (v / 1000).toFixed(1) + 'K'}
                                    style={{ fill: '#71717a', fontSize: 10, fontFamily: 'Inter' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend table */}
                <div className="glass-card" style={{ padding: '24px', marginTop: 16 }}>
                    <h3 style={{ marginBottom: 14, fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Breakdown
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                        {chartData.map((d, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 12px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: 6,
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }}></div>
                                <span style={{ fontSize: '0.825rem', fontWeight: 500, flex: 1, color: 'var(--text-secondary)' }}>{d.fullName}</span>
                                <span style={{ fontSize: '0.825rem', color: '#86efac', fontWeight: 600 }}>₹{d.salary.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 20 }}>
                    <Link to="/list" className="btn btn-ghost">← Back to List</Link>
                </div>
            </div>
        </div>
    )
}
