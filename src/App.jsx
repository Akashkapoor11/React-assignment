import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import DetailsPage from './pages/DetailsPage'
import PhotoResultPage from './pages/PhotoResultPage'
import BarGraphPage from './pages/BarGraphPage'
import MapPage from './pages/MapPage'

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth()
    return isLoggedIn ? children : <Navigate to="/" replace />
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/list" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
                    <Route path="/details/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
                    <Route path="/photo-result" element={<ProtectedRoute><PhotoResultPage /></ProtectedRoute>} />
                    <Route path="/bar-graph" element={<ProtectedRoute><BarGraphPage /></ProtectedRoute>} />
                    <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
