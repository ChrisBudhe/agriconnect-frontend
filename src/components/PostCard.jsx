import { formatDistanceToNow } from 'date-fns'

const AV_COLORS = [
  'linear-gradient(135deg,#4CAF50,#1a5e20)',
  'linear-gradient(135deg,#FF8F00,#E65100)',
  'linear-gradient(135deg,#1565C0,#0D47A1)',
  'linear-gradient(135deg,#6A1B9A,#4A148C)',
  'linear-gradient(135deg,#C62828,#B71C1C)',
  'linear-gradient(135deg,#00695C,#004D40)',
]

function colorFor(name = 'A') {
  return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length]
}

export default function PostCard({ post: p, onLike, preview }) {
  const initials = (p.author_name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const timeAgo = (() => {
    try { return formatDistanceToNow(new Date(p.created_at), { addSuffix: true }) }
    catch { return '' }
  })()

  return (
    <div style={{ background:'#fff', borderRadius:16, padding:14, marginBottom:12, boxShadow:'0 2px 8px rgba(61,35,20,0.1)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        {p.avatar_url
          ? <img src={p.avatar_url} style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} alt=""/>
          : <div style={{ width:38, height:38, borderRadius:'50%', background:colorFor(p.author_name), color:'#fff', fontWeight:800, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{initials}</div>
        }
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#3D2314', display:'flex', alignItems:'center', gap:4 }}>
            {p.author_name}
            {p.is_verified && <span style={{ color:'#1565C0', fontSize:11 }}>✓</span>}
          </div>
          <div style={{ fontSize:10, color:'#6D4C41', opacity:.6 }}>
            {timeAgo}{p.author_location ? ' · ' + p.author_location : ''}
          </div>
        </div>
        {p.is_sponsored
          ? <div style={{ background:'#fff8e1', color:'#C8860A', fontSize:9, fontWeight:800, padding:'3px 8px', borderRadius:6, border:'1px solid #ffe082' }}>Sponsored</div>
          : p.tag && <div style={{ background:'#F5E6C8', color:'#C8860A', fontSize:9, fontWeight:800, padding:'3px 8px', borderRadius:6 }}>{p.tag}</div>
        }
      </div>

      <div style={{ fontSize:13, color:'#6D4C41', lineHeight:1.55, marginBottom: preview ? 0 : 10 }}>
        {preview && p.content.length > 140 ? p.content.slice(0, 140) + '…' : p.content}
      </div>

      {!preview && (
        <div style={{ display:'flex', gap:20, marginTop:10 }}>
          {p.is_sponsored ? (
            <span style={{ fontSize:12, color:'#2D6A2F', fontWeight:700, cursor:'pointer' }}>🛒 Learn More</span>
          ) : (
            <>
              <span
                onClick={onLike}
                style={{ fontSize:12, color:p.liked_by_me?'#e53935':'#6D4C41', opacity:p.liked_by_me?1:.7, fontWeight:600, cursor:'pointer', userSelect:'none' }}
              >
                {p.liked_by_me ? '❤️' : '👍'} {p.likes_count}
              </span>
              <span style={{ fontSize:12, color:'#6D4C41', opacity:.7, fontWeight:600 }}>💬 {p.comments_count}</span>
              <span
                style={{ fontSize:12, color:'#6D4C41', opacity:.7, fontWeight:600, cursor:'pointer' }}
                onClick={() => { navigator.clipboard?.writeText(window.location.origin) }}
              >
                🔗 Share
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
