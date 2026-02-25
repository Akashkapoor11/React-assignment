import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/list" className="navbar-brand">
                <div className="navbar-logo">J</div>
                Jotish Portal
            </Link>
            <div className="navbar-actions">
                <Link to="/list" className="btn btn-ghost btn-sm">Directory</Link>
                <Link to="/bar-graph" className="btn btn-ghost btn-sm">Analytics</Link>
                <Link to="/map" className="btn btn-ghost btn-sm">Map</Link>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">Sign out</button>
            </div>
        </nav>
    )
}
