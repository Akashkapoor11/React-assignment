import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

// Major Indian city coordinates
const CITY_COORDS = {
    'Mumbai': [19.0760, 72.8777], 'Delhi': [28.6139, 77.2090],
    'Bangalore': [12.9716, 77.5946], 'Bengaluru': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867], 'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639], 'Pune': [18.5204, 73.8567],
    'Ahmedabad': [23.0225, 72.5714], 'Jaipur': [26.9124, 75.7873],
    'Surat': [21.1702, 72.8311], 'Lucknow': [26.8467, 80.9462],
    'Kanpur': [26.4499, 80.3319], 'Nagpur': [21.1458, 79.0882],
    'Indore': [22.7196, 75.8577], 'Thane': [19.2183, 72.9781],
    'Bhopal': [23.2599, 77.4126], 'Visakhapatnam': [17.6868, 83.2185],
    'Patna': [25.5941, 85.1376], 'Vadodara': [22.3072, 73.1812],
    'Ghaziabad': [28.6692, 77.4538], 'Agra': [27.1767, 78.0081],
    'Meerut': [28.9845, 77.7064], 'Nashik': [19.9975, 73.7898],
    'Howrah': [22.5958, 88.2636], 'Ranchi': [23.3441, 85.3096],
    'Coimbatore': [11.0168, 76.9558], 'Vijayawada': [16.5062, 80.6480],
    'Chandigarh': [30.7333, 76.7794], 'Mysuru': [12.2958, 76.6394],
    'Guwahati': [26.1445, 91.7362], 'Bhubaneswar': [20.2961, 85.8189],
    'Noida': [28.5355, 77.3910], 'Faridabad': [28.4082, 77.3178],
    'Kochi': [9.9312, 76.2673], 'Navi Mumbai': [19.0330, 73.0297],
    'Trivandrum': [8.5241, 76.9366], 'Jabalpur': [23.1815, 79.9864],
    'Jodhpur': [26.2389, 73.0243], 'Raipur': [21.2514, 81.6296],
    'Kota': [25.2138, 75.8648], 'Gwalior': [26.2183, 78.1828],
    'Amritsar': [31.6340, 74.8723], 'Allahabad': [25.4358, 81.8463],
    'Prayagraj': [25.4358, 81.8463], 'Dhanbad': [23.7957, 86.4304],
    'Jalandhar': [31.3260, 75.5762], 'Bareilly': [28.3670, 79.4304],
    'Aligarh': [27.8974, 78.0880], 'Moradabad': [28.8386, 78.7733],
    'Rajkot': [22.3039, 70.8022], 'Ludhiana': [30.9010, 75.8573],
    'Hapur': [28.7260, 77.7801],
    'Mangalore': [12.9141, 74.8560], 'Mangaluru': [12.9141, 74.8560],
    'Mysore': [12.2958, 76.6394], 'Hubli': [15.3647, 75.1240],
    'Tiruchirappalli': [10.7905, 78.7047], 'Trichy': [10.7905, 78.7047],
    'Salem': [11.6643, 78.1460], 'Tiruppur': [11.1085, 77.3411],
    'Warangal': [17.9784, 79.5941], 'Guntur': [16.3067, 80.4365],
    'Nellore': [14.4426, 79.9865], 'Davangere': [14.4663, 75.9238],
    'Shimla': [31.1048, 77.1734], 'Dehradun': [30.3165, 78.0322],
    'Varanasi': [25.3176, 82.9739], 'Agartala': [23.8315, 91.2868],
}

function findCoords(city) {
    if (!city) return null
    const c = city.trim()
    const exact = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === c.toLowerCase())
    if (exact) return CITY_COORDS[exact]
    const partial = Object.keys(CITY_COORDS).find(k =>
        c.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(c.toLowerCase())
    )
    return partial ? CITY_COORDS[partial] : null
}

const CIRCLE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4', '#10b981']

export default function MapPage() {
    const { employees } = useAuth()

    const keys = employees.length > 0 ? Object.keys(employees[0]) : []
    const nameKey = keys.find(k => /name/i.test(k)) || keys[0]
    const cityKey = keys.find(k => /city|location|place/i.test(k))
    const deptKey = keys.find(k => /dept|department/i.test(k))
    const salKey = keys.find(k => /sal|salary|pay/i.test(k))

    const cityGroups = {}
    employees.forEach((emp) => {
        const city = cityKey ? emp[cityKey] : null
        if (!city) return
        if (!cityGroups[city]) {
            const coords = findCoords(city)
            if (!coords) return
            cityGroups[city] = { coords, employees: [], city }
        }
        cityGroups[city].employees.push(emp)
    })

    const mappedCities = Object.values(cityGroups)
    const unmappedCities = employees
        .filter(e => cityKey && e[cityKey] && !findCoords(e[cityKey]))
        .map(e => e[cityKey])
    const uniqueUnmapped = [...new Set(unmappedCities)]

    const center = mappedCities.length > 0
        ? [mappedCities[0].coords[0], mappedCities[0].coords[1]]
        : [20.5937, 78.9629]

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content animate-in">
                <div className="breadcrumb">
                    <Link to="/list">Directory</Link>
                    <span>›</span>
                    <span>City Map</span>
                </div>

                <div className="page-header">
                    <h1>Employee City Map</h1>
                    <p>Geographic distribution of employees across India</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
                    <div className="stat-card">
                        <div className="stat-label">Cities on Map</div>
                        <div className="stat-value">{mappedCities.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">{employees.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Largest Hub</div>
                        <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                            {mappedCities.length > 0
                                ? mappedCities.reduce((a, b) => a.employees.length > b.employees.length ? a : b).city
                                : '—'}
                        </div>
                    </div>
                </div>

                <div className="map-wrapper" style={{ marginBottom: 20 }}>
                    <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {mappedCities.map((cityData, i) => (
                            <CircleMarker
                                key={cityData.city}
                                center={cityData.coords}
                                radius={Math.max(8, Math.min(28, cityData.employees.length * 5))}
                                fillColor={CIRCLE_COLORS[i % CIRCLE_COLORS.length]}
                                color={CIRCLE_COLORS[i % CIRCLE_COLORS.length]}
                                weight={2}
                                opacity={0.9}
                                fillOpacity={0.45}
                            >
                                <Popup>
                                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                                        <h3 style={{ marginBottom: 6, fontSize: '0.95rem', fontWeight: 600 }}>{cityData.city}</h3>
                                        <p style={{ marginBottom: 8, color: '#555', fontSize: '0.82rem' }}>
                                            {cityData.employees.length} employee{cityData.employees.length > 1 ? 's' : ''}
                                        </p>
                                        {cityData.employees.map((emp, j) => (
                                            <div key={j} style={{ padding: '4px 0', borderTop: '1px solid #eee', fontSize: '0.8rem' }}>
                                                <strong>{emp[nameKey]}</strong>
                                                {deptKey && <span style={{ color: '#666' }}> · {emp[deptKey]}</span>}
                                                {salKey && <span style={{ color: '#2d7e4f', display: 'block', marginLeft: 2 }}>
                                                    ₹ {parseFloat(emp[salKey]).toLocaleString('en-IN')}
                                                </span>}
                                            </div>
                                        ))}
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                {mappedCities.length > 0 && (
                    <div className="table-container" style={{ marginBottom: 20 }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                City Distribution
                            </h3>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>City</th>
                                    <th>Employees</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mappedCities
                                    .sort((a, b) => b.employees.length - a.employees.length)
                                    .map((cd, i) => (
                                        <tr key={cd.city}>
                                            <td><span className="badge badge-gray">{i + 1}</span></td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cd.city}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {cd.employees.map(e => e[nameKey]).join(', ')}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{
                                                        height: 4, width: `${(cd.employees.length / employees.length) * 100}px`,
                                                        background: CIRCLE_COLORS[i % CIRCLE_COLORS.length],
                                                        borderRadius: 2, minWidth: 4, maxWidth: 80
                                                    }}></div>
                                                    <span className="badge badge-blue">{cd.employees.length}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {uniqueUnmapped.length > 0 && (
                    <div className="alert alert-error" style={{ marginBottom: 20 }}>
                        Could not map: {uniqueUnmapped.join(', ')}
                    </div>
                )}

                <Link to="/list" className="btn btn-ghost">← Back to List</Link>
            </div>
        </div>
    )
}
