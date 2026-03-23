import { useState, useEffect } from 'react'
import { useStore, API } from '../store'
import PostCard from '../components/PostCard.jsx'
import { ComposeModal } from '../components/Modals.jsx'

const TAGS = ['all','maize','irrigation','livestock','pestcontrol','prices','tips','conservation']

export default function Community() {
  const { user } = useStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState('all')
  const [showCompose, setShowCompose] = useState(false)

  useEffect(() => {
    setLoading(true)
    API.get('/posts', { params: { tag, limit: 50 } })
      .then(r => setPosts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tag])

  const handleLike = async (postId) => {
    try {
      const { data } = await API.post(`/posts/${postId}/like`)
      setPosts(ps => ps.map(p => p.id === postId
        ? { ...p, liked_by_me: data.liked, likes_count: p.likes_count + (data.liked ? 1 : -1) }
        : p
      ))
    } catch {}
  }

  const onNewPost = (post) => {
    setPosts(ps => [post, ...ps])
    setShowCompose(false)
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#3d1f0e,#1a0a04)', padding:'16px 16px 14px', flexShrink:0 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#fff', fontWeight:700 }}>🌍 Nharaunda</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:2 }}>Community · Share · Dzidza Together</div>
        <div
          onClick={() => setShowCompose(true)}
          style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'10px 14px', marginTop:12, cursor:'pointer' }}
        >
          <div style={{ width:30, height:30, borderRadius:'50%', background:'#4CAF50', color:'#fff', fontWeight:800, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {user?.initials}
          </div>
          <span style={{ flex:1, fontSize:12, color:'rgba(255,255,255,0.4)' }}>Share a tip, question, or update…</span>
          <span style={{ fontSize:16 }}>✏️</span>
        </div>
      </div>

      {/* Tag strip */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'12px 16px', scrollbarWidth:'none', flexShrink:0 }}>
        {TAGS.map(t => (
          <span key={t} onClick={() => setTag(t)} style={{ padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:'nowrap', cursor:'pointer', flexShrink:0, background:tag===t?'#7A4019':'#F5E6C8', color:tag===t?'#fff':'#7A4019', transition:'all 0.2s' }}>
            #{t}
          </span>
        ))}
      </div>

      {/* Feed */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px 90px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#bbb' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🌍</div>
            <div style={{ fontSize:13 }}>Loading posts…</div>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign:'center', padding:48 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌱</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#3D2314', marginBottom:8 }}>
              {tag !== 'all' ? `No posts tagged #${tag} yet` : 'No posts yet'}
            </div>
            <div style={{ fontSize:13, color:'#6D4C41', lineHeight:1.6, marginBottom:20 }}>
              {tag !== 'all' ? 'Be the first to post about this topic!' : 'Start the conversation — share a farming tip, question, or update.'}
            </div>
            <button onClick={() => setShowCompose(true)} style={{ background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'12px 28px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Write First Post
            </button>
          </div>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p} onLike={() => handleLike(p.id)} />)
        )}
      </div>

      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onSuccess={onNewPost} />}
    </div>
  )
}
