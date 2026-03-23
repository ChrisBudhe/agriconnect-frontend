import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Splash from './pages/Splash.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Market from './pages/Market.jsx'
import Community from './pages/Community.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './components/Layout.jsx'

export default function App() {
  const { user, loading, init } = useStore()

  useEffect(() => { init() }, [])

  if (loading) return <Splash />

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/welcome" element={<Onboarding />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/"          element={<Home />} />
          <Route path="/market"    element={<Market />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile"   element={<Profile />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}
