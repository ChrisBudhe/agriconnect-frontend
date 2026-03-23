import { useState, useEffect } from 'react'
import { useStore, API } from '../store'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout, updateUser } = useStore()
  const [myListings, setMyListings] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    API.get('/listings/user/mine').then(r => setMyListings(r.data)).catch(() => {})
    API.get('/posts?limit=100').then(r => {
      setMyPosts(r.data.filter(p => p.user_id === user?.id))
    }).catch(() => {})
  }, [user?.id])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const { data } = await API.put('/auth/profile', {
        name: form.name,
        bio: form.bio,
        province: user?.province,
        farmSize: user?.farm_size,
        crops: user?.crops,
      })
      updateUser(data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    setSaving(false)
  }

  const shareApp = () => {
    const url = window.location.origin
    if (navigator.share) {
      navigator.share({ title:'AgriConnect Zimbabwe', text:'Join me on AgriConnect — the app for Zimbabwean farmers!', url })
    } else {
      navigator.clipboard?.writeText(url)
      toast.success('🔗 Link copied!')
    }
  }

  const activeListings = myListings.filter(l => l.is_active)
  const boostedListings = myListings.filter(l => l.is_boosted)

  return (
    <div style={{ height:'100%', overflowY:'auto' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,#3D2314,#1a0a04)', padding:'24px 16px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-10, bottom:-10, fontSize:100, opacity:.07, transform:'rotate(20deg)', pointerEvents:'none' }}>🌿</div>
        <div style={{ width:76, height:76, borderRadius:'50%', background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', fontSize:30, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', border:'3px solid rgba(255,255,255,0.2)' }}>
          {user?.initials}
        </div>
        {editing ? (
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', borderRadius:8, padding:'6px 12px', fontSize:18, fontWeight:700, textAlign:'center', width:'80%', fontFamily:"'Playfair Display',serif", outline:'none' }}
          />
        ) : (
          <div style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:22, fontWeight:700 }}>{user?.name}</div>
        )}
        <div style={{ color:'#8BC34A', fontSize:12, marginTop:4 }}>📍 {user?.province}</div>
        {user?.is_verified && (
          <div style={{ display:'inline-block', marginTop:8, background:'rgba(139,195,74,0.2)', color:'#8BC34A', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, border:'1px solid rgba(139,195,74,0.4)' }}>✓ Verified Farmer</div>
        )}
        <div style={{ display:'flex', justifyContent:'center', gap:32, marginTop:20 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{activeListings.length}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:2 }}>Listings</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{myPosts.length}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:2 }}>Posts</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{boostedListings.length}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:2 }}>Boosted</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'16px 16px 100px' }}>

        {/* Edit / Save buttons */}
        {editing && (
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            <button onClick={() => { setEditing(false); setForm({ name:user?.name||'', bio:user?.bio||'' }) }} style={{ flex:1, background:'#F5E6C8', color:'#6D4C41', border:'none', padding:'12px', borderRadius:12, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>Cancel</button>
            <button onClick={saveProfile} disabled={saving} style={{ flex:1, background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'12px', borderRadius:12, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?0.7:1 }}>{saving?'Saving…':'Save Changes'}</button>
          </div>
        )}

        {/* Farm Details */}
        <div style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:14, boxShadow:'0 2px 8px rgba(61,35,20,0.1)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:'#3D2314' }}>🌾 Farm Details</span>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ background:'#F5E6C8', color:'#3D2314', border:'none', padding:'6px 16px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700, cursor:'pointer' }}>Edit</button>
            )}
          </div>
          {[
            { i:'📐', v:user?.farm_size || 'Not specified', l:'Farm Size' },
            { i:'🌱', v:user?.crops?.length ? user.crops.join(', ') : 'Not specified', l:'Crops / Livestock' },
            { i:'📍', v:user?.province, l:'Province' },
            { i:'📱', v:'+263 ' + user?.phone, l:'Phone' },
          ].map(r => (
            <div key={r.l} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'#F5E6C8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{r.i}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#3D2314' }}>{r.v}</div>
                <div style={{ fontSize:10, color:'#6D4C41', opacity:.6 }}>{r.l}</div>
              </div>
            </div>
          ))}
          {editing && (
            <div style={{ marginTop:8 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#6D4C41', marginBottom:4 }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Tell other farmers about yourself, your farm, and what you grow…"
                style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #e0d5c5', borderRadius:10, fontFamily:"'Nunito',sans-serif", fontSize:13, resize:'none', outline:'none', color:'#3D2314' }}
              />
            </div>
          )}
          {!editing && user?.bio && (
            <div style={{ fontSize:13, color:'#6D4C41', lineHeight:1.55, borderTop:'1px solid #f5ece0', paddingTop:10, marginTop:4 }}>{user.bio}</div>
          )}
        </div>

        {/* My Active Listings */}
        <div style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:14, boxShadow:'0 2px 8px rgba(61,35,20,0.1)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:'#3D2314', marginBottom:12 }}>📦 My Listings ({activeListings.length})</div>
          {activeListings.length === 0 ? (
            <div style={{ textAlign:'center', padding:'12px 0', color:'#bbb', fontSize:13 }}>You have no active listings yet</div>
          ) : (
            activeListings.slice(0, 5).map(l => (
              <div key={l.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom:'1px solid #f5ece0' }}>
                <span style={{ fontSize:24 }}>{l.emoji || '🌱'}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#3D2314' }}>{l.title}</div>
                  <div style={{ fontSize:11, color:'#6D4C41', opacity:.7 }}>${l.price} {l.unit} · {l.views_count || 0} views</div>
                </div>
                {l.is_boosted && <span style={{ background:'#E8A020', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:6 }}>⚡ BOOSTED</span>}
              </div>
            ))
          )}
        </div>

        {/* Share */}
        <div style={{ background:'rgba(45,106,47,0.08)', border:'1px solid rgba(45,106,47,0.2)', borderRadius:16, padding:16, marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#3D2314', marginBottom:4 }}>📲 Invite Fellow Farmers</div>
          <div style={{ fontSize:12, color:'#6D4C41', marginBottom:12 }}>Share AgriConnect with other farmers in your area</div>
          <button onClick={shareApp} style={{ background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'10px 28px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer' }}>
            Share App 🌿
          </button>
        </div>

        <button
          onClick={() => { if (confirm('Sign out of AgriConnect?')) logout() }}
          style={{ width:'100%', background:'transparent', color:'#e53935', border:'1px solid #ef9a9a', padding:'12px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
