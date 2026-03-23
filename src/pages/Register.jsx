import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store'
import toast from 'react-hot-toast'

const PROVINCES = ['Harare','Bulawayo','Mashonaland East','Mashonaland West','Mashonaland Central','Matabeleland North','Matabeleland South','Midlands','Masvingo','Manicaland']
const CROPS = [{e:'🌽',n:'Maize'},{e:'🍂',n:'Tobacco'},{e:'🥦',n:'Vegetables'},{e:'🍎',n:'Fruits'},{e:'🥜',n:'Groundnuts'},{e:'🐄',n:'Cattle'},{e:'🐐',n:'Goats'},{e:'🐔',n:'Poultry'},{e:'🥛',n:'Dairy'},{e:'🌾',n:'Sorghum'}]
const inp = { width:'100%', padding:'12px 14px', border:'1.5px solid #e0d5c5', borderRadius:10, fontFamily:"'Nunito',sans-serif", fontSize:14, color:'#3D2314', background:'#fff', outline:'none' }
const Fld = ({label, children}) => <div style={{marginBottom:16}}><label style={{display:'block',fontSize:13,fontWeight:700,color:'#6D4C41',marginBottom:6}}>{label}</label>{children}</div>

export default function Register() {
  const [form, setForm] = useState({ name:'', phone:'', password:'', province:'', farmSize:'' })
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(false)
  const { register } = useStore()
  const nav = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleCrop = (c) => setCrops(cs => cs.includes(c) ? cs.filter(x=>x!==c) : [...cs, c])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.password || !form.province) return toast.error('Please fill all required fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register({ ...form, crops: crops.length ? crops : ['Maize'] })
      toast.success('Welcome to AgriConnect! 🌿')
      nav('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'#FFFDF8', display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ background:'linear-gradient(160deg,#2D6A2F,#1a4520)', padding:'60px 24px 28px', textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🌿</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:24, fontWeight:700 }}>Create Farm Profile</h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:4 }}>Rejistra murimi · Register as a farmer</p>
      </div>
      <form onSubmit={submit} style={{ padding:24, maxWidth:480, margin:'0 auto', width:'100%', paddingBottom:40 }}>
        <Fld label="Full Name *">
          <input style={inp} placeholder="e.g. Tendai Moyo" value={form.name} onChange={e=>set('name',e.target.value)} maxLength={100}/>
        </Fld>
        <Fld label="Phone Number *">
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ padding:'12px 14px', background:'#F5E6C8', borderRadius:10, fontSize:13, fontWeight:700, border:'1.5px solid #e0d5c5', whiteSpace:'nowrap' }}>🇿🇼 +263</span>
            <input style={inp} type="tel" placeholder="77 123 4567" value={form.phone} onChange={e=>set('phone',e.target.value)} maxLength={12}/>
          </div>
        </Fld>
        <Fld label="Password *">
          <input style={inp} type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set('password',e.target.value)}/>
        </Fld>
        <Fld label="Province *">
          <select style={inp} value={form.province} onChange={e=>set('province',e.target.value)}>
            <option value="">Select province...</option>
            {PROVINCES.map(p => <option key={p}>{p}</option>)}
          </select>
        </Fld>
        <Fld label="Farm Size">
          <select style={inp} value={form.farmSize} onChange={e=>set('farmSize',e.target.value)}>
            <option value="">Select size...</option>
            {['Under 1 acre','1–5 acres','5–20 acres','20–100 acres','100+ acres'].map(s=><option key={s}>{s}</option>)}
          </select>
        </Fld>
        <Fld label="What do you farm? (tap to select)">
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
            {CROPS.map(c => (
              <span key={c.n} onClick={()=>toggleCrop(c.n)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', background:crops.includes(c.n)?'#2D6A2F':'#F5E6C8', color:crops.includes(c.n)?'#fff':'#6D4C41', border:`1.5px solid ${crops.includes(c.n)?'#2D6A2F':'transparent'}`, transition:'all 0.2s' }}>
                {c.e} {c.n}
              </span>
            ))}
          </div>
        </Fld>
        <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'14px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1, marginBottom:16 }}>
          {loading ? 'Creating profile…' : 'Create Profile 🌱'}
        </button>
        <p style={{ textAlign:'center', fontSize:13, color:'#6D4C41' }}>
          Already registered? <Link to="/login" style={{ color:'#2D6A2F', fontWeight:700 }}>Log in</Link>
        </p>
      </form>
    </div>
  )
}
