import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, API } from '../store'
import { AdvisorModal } from '../components/Modals.jsx'
import ListingCard from '../components/ListingCard.jsx'
import PostCard from '../components/PostCard.jsx'

export default function Home() {
  const { user } = useStore()
  const nav = useNavigate()
  const [featured, setFeatured] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [showAdvisor, setShowAdvisor] = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Mangwanani 🌤' : hour < 17 ? 'Masikati ☀️' : 'Manheru 🌙'

  useEffect(() => {
    API.get('/listings?boosted=true&limit=6')
      .then(r => setFeatured(r.data.listings))
      .catch(() => {})
      .finally(() => setLoadingListings(false))

    API.get('/posts?limit=3')
      .then(r => setPosts(r.data))
      .catch(() => {})
      .finally(() => setLoadingPosts(false))
  }, [])

  return (
    <div style={{ height:'100%', overflowY:'auto' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,#2D6A2F,#1a4520)', padding:'20px 16px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-16, bottom:-10, fontSize:100, opacity:.08, transform:'rotate(15deg)', pointerEvents:'none' }}>🌾</div>
        <div style={{ color:'rgba(255,255,255,0.65)', fontSize:13 }}>{greeting}</div>
        <div style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:22, fontWeight:700, marginTop:2 }}>{user?.name}</div>
        <div style={{ color:'#8BC34A', fontSize:12, marginTop:2 }}>📍 {user?.province}</div>
      </div>

      {/* AI Advisor Banner */}
      <div style={{ margin:'12px 16px', background:'linear-gradient(135deg,#1a3a1c,#2d5a1e)', border:'1px solid rgba(139,195,74,0.3)', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:28 }}>🤖</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#8BC34A' }}>AI Farm Advisor</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:2 }}>Ask about crops, pests, prices, irrigation…</div>
        </div>
        <button onClick={() => setShowAdvisor(true)} style={{ background:'#8BC34A', color:'#1a4520', border:'none', padding:'8px 16px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap' }}>
          Ask →
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#3D2314', fontWeight:700, marginBottom:12 }}>Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
          {[
            { bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', col:'#2D6A2F', e:'📦', l:'Sell Produce', fn:()=>nav('/market') },
            { bg:'linear-gradient(135deg,#fff8e1,#ffecb3)', col:'#C8860A', e:'⚡',  l:'Boost Ad',     fn:()=>nav('/market') },
            { bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)', col:'#1565c0', e:'💬', l:'Community',    fn:()=>nav('/community') },
            { bg:'linear-gradient(135deg,#f3e5f5,#e1bee7)', col:'#7b1fa2', e:'👤', l:'My Profile',   fn:()=>nav('/profile') },
          ].map(q => (
            <div key={q.l} onClick={q.fn} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'14px 8px', borderRadius:16, background:q.bg, color:q.col, cursor:'pointer' }}>
              <span style={{ fontSize:24 }}>{q.e}</span>
              <span style={{ fontSize:10, fontWeight:700, textAlign:'center' }}>{q.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#3D2314', fontWeight:700 }}>⚡ Featured Listings</span>
          <span onClick={()=>nav('/market')} style={{ fontSize:12, color:'#2D6A2F', fontWeight:700, cursor:'pointer' }}>See all</span>
        </div>
        {loadingListings ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'#bbb', fontSize:13 }}>Loading…</div>
        ) : featured.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:24, textAlign:'center', boxShadow:'0 2px 8px rgba(61,35,20,0.08)' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🌱</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#3D2314' }}>No featured listings yet</div>
            <div style={{ fontSize:12, color:'#6D4C41', marginTop:4 }}>Be the first to post and boost a listing!</div>
            <button onClick={()=>nav('/market')} style={{ marginTop:12, background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Post a Listing
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:12, scrollbarWidth:'none' }}>
            {featured.map(l => (
              <div key={l.id} style={{ minWidth:140, flexShrink:0 }}>
                <ListingCard listing={l} compact />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Feed Preview */}
      <div style={{ padding:'20px 16px', paddingBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#3D2314', fontWeight:700 }}>💬 Community Feed</span>
          <span onClick={()=>nav('/community')} style={{ fontSize:12, color:'#2D6A2F', fontWeight:700, cursor:'pointer' }}>See all</span>
        </div>
        {loadingPosts ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'#bbb', fontSize:13 }}>Loading…</div>
        ) : posts.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:24, textAlign:'center', boxShadow:'0 2px 8px rgba(61,35,20,0.08)' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🌍</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#3D2314' }}>No posts yet</div>
            <div style={{ fontSize:12, color:'#6D4C41', marginTop:4 }}>Share a tip or question with fellow farmers!</div>
            <button onClick={()=>nav('/community')} style={{ marginTop:12, background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Post Something
            </button>
          </div>
        ) : (
          posts.filter(p => !p.is_sponsored).slice(0, 2).map(p => <PostCard key={p.id} post={p} preview />)
        )}
      </div>

      <div style={{ height:20 }} />
      {showAdvisor && <AdvisorModal onClose={() => setShowAdvisor(false)} />}
    </div>
  )
}
