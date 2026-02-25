import { useState, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function formatSalary(salary) {
    const num = parseFloat(salary)
    if (isNaN(num)) return salary
    return '₹ ' + num.toLocaleString('en-IN')
}

export default function DetailsPage() {
    const { id } = useParams()
    const { employees, setCapturedPhoto } = useAuth()
    const navigate = useNavigate()

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    const [cameraOpen, setCameraOpen] = useState(false)
    const [cameraError, setCameraError] = useState('')
    const [capturing, setCapturing] = useState(false)

    const keys = employees.length > 0 ? Object.keys(employees[0]) : []
    const idKey = keys.find(k => /^id$/i.test(k)) || keys.find(k => /id/i.test(k)) || keys[0]
    const nameKey = keys.find(k => /name/i.test(k)) || keys[0]
    const salKey = keys.find(k => /sal|salary|pay/i.test(k))

    const employee = employees.find((e, i) => String(e[idKey] || i) === String(id))

    const startCamera = useCallback(async () => {
        setCameraError('')
        setCameraOpen(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
        } catch {
            setCameraError('Could not access camera. Please allow camera permissions in your browser.')
            setCameraOpen(false)
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setCameraOpen(false)
    }, [])

    const takePhoto = useCallback(() => {
        setCapturing(true)
        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        setCapturedPhoto(dataUrl)
        stopCamera()
        setTimeout(() => {
            setCapturing(false)
            navigate('/photo-result')
        }, 200)
    }, [setCapturedPhoto, stopCamera, navigate])

    if (!employee) {
        return (
            <div className="page-container">
                <Navbar />
                <div className="page-content">
                    <div className="alert alert-error">Employee not found.</div>
                    <Link to="/list" className="btn btn-ghost" style={{ marginTop: 16 }}>← Back to List</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content animate-in">
                <div className="breadcrumb">
                    <Link to="/list">Directory</Link>
                    <span>›</span>
                    <span>{employee[nameKey] || 'Details'}</span>
                </div>

                {/* Hero Card */}
                <div className="glass-card" style={{ padding: '28px 32px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: '14px',
                            background: 'rgba(59,130,246,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.25rem', fontWeight: 700, color: '#93c5fd',
                            flexShrink: 0, letterSpacing: '-0.05em'
                        }}>
                            {(employee[nameKey] || '?').slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                {employee[nameKey]}
                            </h1>
                            {salKey && (
                                <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                                    {formatSalary(employee[salKey])}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Fields */}
                <div className="detail-grid" style={{ marginBottom: '24px' }}>
                    {Object.entries(employee).map(([key, val]) => (
                        <div className="detail-item" key={key}>
                            <div className="detail-label">{key.replace(/_/g, ' ')}</div>
                            <div className="detail-value">
                                {key === salKey ? formatSalary(val) : String(val) || '—'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Camera Section */}
                <div className="glass-card" style={{ padding: '28px 32px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Photo Capture</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.825rem' }}>
                        Capture a photo using your device's camera
                    </p>

                    {cameraError && <div className="alert alert-error" style={{ marginBottom: 16 }}>{cameraError}</div>}

                    {!cameraOpen ? (
                        <button id="open-camera-btn" className="btn btn-primary" onClick={startCamera}>
                            Open Camera
                        </button>
                    ) : (
                        <div className="camera-container">
                            <video ref={videoRef} className="camera-preview" autoPlay playsInline muted />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div className="camera-btn-group">
                                <button
                                    id="take-photo-btn"
                                    className="btn btn-primary"
                                    onClick={takePhoto}
                                    disabled={capturing}
                                >
                                    {capturing ? 'Processing…' : 'Capture Photo'}
                                </button>
                                <button className="btn btn-ghost" onClick={stopCamera}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/list" className="btn btn-ghost">← Back to List</Link>
            </div>
        </div>
    )
}
