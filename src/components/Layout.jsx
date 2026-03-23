import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

const NAV = [
  { path: '/',          icon: '🏠', label: 'Home'      },
  { path: '/market',    icon: '🛒', label: 'Market'    },
  { path: '/community', icon: '💬', label: 'Community' },
  { path: '/profile',   icon: '👤', label: 'Profile'   },
]

export default function Layout() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { user } = useStore()

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#F9F5EE', maxWidth:430, margin:'0 auto', position:'relative', overflow:'hidden' }}>
      {/* Topbar */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'#FFFDF8', borderBottom:'1px solid rgba(224,213,197,0.6)', boxShadow:'0 2px 8px rgba(61,35,20,0.08)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:22 }}>🌿</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#2D6A2F' }}>AgriConnect</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:18, cursor:'pointer' }}>🔔</span>
          <div
            onClick={() => nav('/profile')}
            style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', fontWeight:800, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
          >
            {user?.initials || '?'}
          </div>
        </div>
      </header>

      {/* Page content */}
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
        <Outlet />
      </div>

      {/* Bottom nav */}
      <nav style={{ display:'flex', background:'#FFFDF8', borderTop:'1px solid rgba(224,213,197,0.6)', padding:'6px 0 10px', boxShadow:'0 -2px 12px rgba(61,35,20,0.08)', flexShrink:0 }}>
        {NAV.map(n => {
          const active = pathname === n.path
          return (
            <div key={n.path} onClick={() => nav(n.path)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer' }}>
              <span style={{ fontSize:22, transform:active?'translateY(-2px)':'none', filter:active?'drop-shadow(0 2px 8px rgba(45,106,47,0.4))':'none', transition:'all 0.2s' }}>{n.icon}</span>
              <span style={{ fontSize:9, fontWeight:700, color:active?'#2D6A2F':'#bbb' }}>{n.label}</span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
