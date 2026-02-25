import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(username, password)
            navigate('/list')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card animate-in">
                <div className="login-logo">
                    <div className="login-logo-mark">J</div>
                    <h1>Jotish Portal</h1>
                    <p>Employee Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                id="username"
                                className="input-field"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                id="password"
                                className="input-field"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                className="input-icon"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '●' : '○'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error animate-in">
                            {error}
                        </div>
                    )}

                    <button
                        id="login-btn"
                        type="submit"
                        className="btn btn-primary btn-lg login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="btn-spinner"></span> Signing in…</>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <div className="login-hint">
                    Demo credentials: <code>testuser</code> / <code>Test123</code>
                </div>
            </div>
        </div>
    )
}
