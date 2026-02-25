import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PhotoResultPage() {
    const { capturedPhoto, setCapturedPhoto } = useAuth()
    const navigate = useNavigate()

    const handleDownload = () => {
        const a = document.createElement('a')
        a.href = capturedPhoto
        a.download = `jotish-photo-${Date.now()}.png`
        a.click()
    }

    const handleRetake = () => {
        setCapturedPhoto(null)
        navigate(-1)
    }

    if (!capturedPhoto) {
        return (
            <div className="page-container">
                <Navbar />
                <div className="page-content">
                    <div className="alert alert-error">No photo found. Please capture a photo first.</div>
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
                    <span>Photo Result</span>
                </div>

                <div className="page-header">
                    <h1>Captured Photo</h1>
                    <p>Review and download your photo</p>
                </div>

                <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    <div className="alert alert-success" style={{ width: '100%', maxWidth: 600 }}>
                        Photo captured successfully
                    </div>

                    <div style={{ position: 'relative' }}>
                        <img
                            src={capturedPhoto}
                            alt="Captured photo"
                            className="photo-result-img"
                            id="captured-image"
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            background: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(8px)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            color: 'rgba(255,255,255,0.75)',
                            border: '1px solid rgba(255,255,255,0.12)'
                        }}>
                            {new Date().toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button id="download-photo-btn" className="btn btn-success" onClick={handleDownload}>
                            Download
                        </button>
                        <button className="btn btn-ghost" onClick={handleRetake}>
                            Retake
                        </button>
                        <Link to="/list" className="btn btn-ghost">← Back to List</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
