import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store'
import toast from 'react-hot-toast'

const inp = { width:'100%', padding:'12px 14px', border:'1.5px solid #e0d5c5', borderRadius:10, fontFamily:"'Nunito',sans-serif", fontSize:14, color:'#3D2314', background:'#fff', outline:'none' }

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useStore()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!phone || !password) return toast.error('Enter phone and password')
    setLoading(true)
    try {
      await login(phone, password)
      nav('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'#FFFDF8', display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ background:'linear-gradient(160deg,#2D6A2F,#1a4520)', padding:'60px 24px 32px', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🌿</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:26, fontWeight:900 }}>Welcome Back</h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginTop:4 }}>Log in to AgriConnect Zimbabwe</p>
      </div>
      <form onSubmit={submit} style={{ padding:24, maxWidth:480, margin:'0 auto', width:'100%' }}>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#6D4C41', marginBottom:6 }}>Phone Number</label>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ padding:'12px 14px', background:'#F5E6C8', borderRadius:10, fontSize:13, fontWeight:700, border:'1.5px solid #e0d5c5', whiteSpace:'nowrap' }}>🇿🇼 +263</span>
            <input style={inp} placeholder="77 123 4567" value={phone} onChange={e=>setPhone(e.target.value)} type="tel"/>
          </div>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#6D4C41', marginBottom:6 }}>Password</label>
          <input style={inp} type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)}/>
        </div>
        <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'14px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1 }}>
          {loading ? 'Logging in…' : 'Log In 🌿'}
        </button>
        <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#6D4C41' }}>
          No account? <Link to="/register" style={{ color:'#2D6A2F', fontWeight:700 }}>Register free</Link>
        </p>
      </form>
    </div>
  )
}
