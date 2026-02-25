import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({})

// Realistic demo data — used when the API is unreachable
const DEMO_EMPLOYEES = [
    { id: 1, name: "Arjun Sharma", city: "Mumbai", department: "Engineering", salary: 95000, email: "arjun.sharma@jotish.in", phone: "9821000001" },
    { id: 2, name: "Priya Mehta", city: "Bangalore", department: "Design", salary: 87000, email: "priya.mehta@jotish.in", phone: "9821000002" },
    { id: 3, name: "Rohan Gupta", city: "Delhi", department: "Sales", salary: 72000, email: "rohan.gupta@jotish.in", phone: "9821000003" },
    { id: 4, name: "Sneha Patel", city: "Pune", department: "HR", salary: 68000, email: "sneha.patel@jotish.in", phone: "9821000004" },
    { id: 5, name: "Vikram Nair", city: "Chennai", department: "Engineering", salary: 110000, email: "vikram.nair@jotish.in", phone: "9821000005" },
    { id: 6, name: "Ananya Singh", city: "Hyderabad", department: "Marketing", salary: 78000, email: "ananya.singh@jotish.in", phone: "9821000006" },
    { id: 7, name: "Karthik Reddy", city: "Bangalore", department: "Engineering", salary: 98000, email: "karthik.reddy@jotish.in", phone: "9821000007" },
    { id: 8, name: "Deepika Iyer", city: "Mumbai", department: "Finance", salary: 82000, email: "deepika.iyer@jotish.in", phone: "9821000008" },
    { id: 9, name: "Rahul Joshi", city: "Delhi", department: "Operations", salary: 65000, email: "rahul.joshi@jotish.in", phone: "9821000009" },
    { id: 10, name: "Meera Pillai", city: "Kochi", department: "Engineering", salary: 91000, email: "meera.pillai@jotish.in", phone: "9821000010" },
    { id: 11, name: "Amit Kulkarni", city: "Pune", department: "Sales", salary: 74000, email: "amit.kulkarni@jotish.in", phone: "9821000011" },
    { id: 12, name: "Pooja Verma", city: "Jaipur", department: "HR", salary: 61000, email: "pooja.verma@jotish.in", phone: "9821000012" },
    { id: 13, name: "Suresh Rao", city: "Hyderabad", department: "Engineering", salary: 104000, email: "suresh.rao@jotish.in", phone: "9821000013" },
    { id: 14, name: "Kavitha Nayak", city: "Mangalore", department: "Design", salary: 79000, email: "kavitha.nayak@jotish.in", phone: "9821000014" },
    { id: 15, name: "Nikhil Tiwari", city: "Lucknow", department: "Operations", salary: 58000, email: "nikhil.tiwari@jotish.in", phone: "9821000015" },
]

async function fetchWithTimeout(url, options, timeoutMs = 10000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const res = await fetch(url, { ...options, signal: controller.signal })
        return res
    } finally {
        clearTimeout(timer)
    }
}

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [employees, setEmployees] = useState([])
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const [usingDemo, setUsingDemo] = useState(false)

    const login = async (username, password) => {
        if (username !== 'testuser' || password !== 'Test123') {
            throw new Error('Invalid credentials. Use testuser / Test123')
        }

        const extractList = (data) => {
            if (Array.isArray(data) && data.length > 0) return data
            if (data && typeof data === 'object') {
                const knownKeys = ['TABLE_DATA', 'data', 'employees', 'records', 'rows', 'result', 'results']
                const hit = knownKeys.find(k => Array.isArray(data[k]) && data[k].length > 0)
                if (hit) return data[hit]
                const anyArr = Object.keys(data).find(k => Array.isArray(data[k]) && data[k].length > 0)
                if (anyArr) return data[anyArr]
            }
            return []
        }

        const PROXY = '/api/backend_dev/gettabledata.php'

        try {
            const resp = await fetchWithTimeout(
                PROXY,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'test', password: '123456' })
                },
                10000
            )
            const text = await resp.text()
            try {
                const data = JSON.parse(text)
                const list = extractList(data)
                if (list.length > 0) {
                    setEmployees(list)
                    setUsingDemo(false)
                    setIsLoggedIn(true)
                    return list
                }
            } catch { /* not JSON, fall through to demo */ }
        } catch { /* network error, fall through to demo */ }

        // API unavailable — use demo data so the app still functions
        setEmployees(DEMO_EMPLOYEES)
        setUsingDemo(true)
        setIsLoggedIn(true)
        return DEMO_EMPLOYEES
    }

    const logout = () => {
        setIsLoggedIn(false)
        setEmployees([])
        setCapturedPhoto(null)
        setUsingDemo(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, employees, capturedPhoto, setCapturedPhoto, login, logout, usingDemo }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext) || {}
}
