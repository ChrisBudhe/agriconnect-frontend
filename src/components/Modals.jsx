import { useState } from 'react'
import { API } from '../store'
import toast from 'react-hot-toast'

// ─── MODAL SHELL ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(20,10,4,0.65)', backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:'#FFFDF8', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, maxHeight:'92vh', overflowY:'auto', animation:'modalUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <style>{`@keyframes modalUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 20px 16px', borderBottom:'1px solid #f0e8d8', position:'sticky', top:0, background:'#FFFDF8', zIndex:1 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#3D2314' }}>{title}</span>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:'50%', background:'#F5E6C8', border:'none', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:'16px 20px 30px' }}>{children}</div>
      </div>
    </div>
  )
}

const inp = { width:'100%', padding:'12px 14px', border:'1.5px solid #e0d5c5', borderRadius:10, fontFamily:"'Nunito',sans-serif", fontSize:14, color:'#3D2314', background:'#fff', outline:'none', marginTop:6 }
const Fld = ({ label, children }) => <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:13, fontWeight:700, color:'#6D4C41' }}>{label}</label>{children}</div>
const PrimaryBtn = ({ onClick, loading, children }) => (
  <button onClick={onClick} disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'14px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1 }}>
    {loading ? 'Please wait…' : children}
  </button>
)

// ─── ADD LISTING ──────────────────────────────────────────────────────────────
export function AddListingModal({ onClose, onSuccess }) {
  const [f, setF] = useState({ title:'', category:'Grains', emoji:'', description:'', price:'', unit:'', quantity:'', location:'' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))

  const submit = async () => {
    if (!f.title.trim()) return toast.error('Product name is required')
    if (!f.price || isNaN(parseFloat(f.price))) return toast.error('Enter a valid price')
    if (!f.unit.trim()) return toast.error('Unit is required (e.g. per 50kg bag)')
    setLoading(true)
    try {
      const { data } = await API.post('/listings', {
        title: f.title.trim(),
        category: f.category,
        emoji: f.emoji || '🌱',
        description: f.description.trim(),
        price: parseFloat(f.price),
        unit: f.unit.trim(),
        quantity: f.quantity.trim(),
        location: f.location.trim(),
      })
      toast.success('✅ Listing posted!')
      onSuccess(data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post listing')
    }
    setLoading(false)
  }

  return (
    <Modal title="📦 Post a Listing" onClose={onClose}>
      <Fld label="Product Name *">
        <input style={inp} placeholder="e.g. White Maize, Fresh Tomatoes, Broiler Chickens…" value={f.title} onChange={e => set('title', e.target.value)} maxLength={150}/>
      </Fld>
      <div style={{ display:'flex', gap:12 }}>
        <Fld label="Category">
          <select style={inp} value={f.category} onChange={e => set('category', e.target.value)}>
            {['Grains','Vegetables','Fruits','Livestock','Dairy','Poultry','Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Fld>
        <Fld label="Emoji">
          <input style={{ ...inp, width:70 }} placeholder="🌽" maxLength={2} value={f.emoji} onChange={e => set('emoji', e.target.value)}/>
        </Fld>
      </div>
      <div style={{ display:'flex', gap:12 }}>
        <Fld label="Price (USD) *">
          <input style={inp} type="number" placeholder="12.00" min="0" step="0.50" value={f.price} onChange={e => set('price', e.target.value)}/>
        </Fld>
        <Fld label="Per / Unit *">
          <input style={inp} placeholder="50kg bag" value={f.unit} onChange={e => set('unit', e.target.value)}/>
        </Fld>
      </div>
      <div style={{ display:'flex', gap:12 }}>
        <Fld label="Quantity Available">
          <input style={inp} placeholder="e.g. 200 bags" value={f.quantity} onChange={e => set('quantity', e.target.value)}/>
        </Fld>
        <Fld label="Location">
          <input style={inp} placeholder="e.g. Mazowe" value={f.location} onChange={e => set('location', e.target.value)}/>
        </Fld>
      </div>
      <Fld label="Description (optional)">
        <textarea style={{ ...inp, resize:'none' }} rows={3} placeholder="Describe quality, freshness, delivery options, payment methods…" value={f.description} onChange={e => set('description', e.target.value)} maxLength={500}/>
      </Fld>
      <div style={{ background:'#fff8e1', border:'1.5px solid #ffe082', borderRadius:10, padding:'12px 14px', marginBottom:16, fontSize:12, color:'#7A4019', lineHeight:1.5 }}>
        ⚡ <strong>Want more buyers?</strong> After posting, you can boost your listing for $2–$10 via EcoCash to appear at the top of search results.
      </div>
      <PrimaryBtn loading={loading} onClick={submit}>Post Listing 🌱</PrimaryBtn>
    </Modal>
  )
}

// ─── COMPOSE POST ─────────────────────────────────────────────────────────────
export function ComposeModal({ onClose, onSuccess }) {
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const TAGS = ['maize','irrigation','livestock','pestcontrol','prices','tips','conservation']
  const toggle = t => setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t])

  const submit = async () => {
    if (!content.trim()) return toast.error('Write something first')
    if (content.trim().length < 10) return toast.error('Post must be at least 10 characters')
    setLoading(true)
    try {
      const { data } = await API.post('/posts', {
        content: content.trim(),
        tag: tags.length ? '#' + tags[0] : null,
      })
      toast.success('🌍 Posted to community!')
      onSuccess(data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post')
    }
    setLoading(false)
  }

  return (
    <Modal title="📝 Share with Farmers" onClose={onClose}>
      <textarea
        style={{ ...inp, resize:'none', minHeight:120 }}
        placeholder="Share a farming tip, ask a question, announce your harvest…"
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={1000}
        autoFocus
      />
      <div style={{ textAlign:'right', fontSize:11, color:'#bbb', marginTop:4, marginBottom:12 }}>{content.length}/1000</div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#6D4C41', marginBottom:8 }}>Tag your post (optional):</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {TAGS.map(t => (
            <span key={t} onClick={() => toggle(t)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', background:tags.includes(t)?'#7A4019':'#F5E6C8', color:tags.includes(t)?'#fff':'#7A4019', transition:'all 0.2s' }}>
              #{t}
            </span>
          ))}
        </div>
      </div>
      <PrimaryBtn loading={loading} onClick={submit}>Post to Community 🌍</PrimaryBtn>
    </Modal>
  )
}

// ─── LISTING DETAIL ───────────────────────────────────────────────────────────
const CAT_BG = { Grains:'linear-gradient(135deg,#fff9c4,#f9a825)', Vegetables:'linear-gradient(135deg,#e8f5e9,#a5d6a7)', Fruits:'linear-gradient(135deg,#fce4ec,#f48fb1)', Livestock:'linear-gradient(135deg,#efebe9,#bcaaa4)', Dairy:'linear-gradient(135deg,#e3f2fd,#90caf9)', Poultry:'linear-gradient(135deg,#fff3e0,#ffcc80)', Other:'linear-gradient(135deg,#f5f5f5,#eee)' }

export function ListingDetailModal({ listing: l, onClose }) {
  const waMsg = encodeURIComponent(`Hi! I found your listing for *${l.title}* on AgriConnect Zimbabwe. Is it still available?`)
  const waUrl = `https://wa.me/${(l.farmer_phone||'').replace(/\D/g,'')}?text=${waMsg}`

  return (
    <Modal title={l.title} onClose={onClose}>
      {l.images?.length > 0 ? (
        <img src={l.images[0]} alt={l.title} style={{ width:'100%', height:180, objectFit:'cover', borderRadius:12, marginBottom:16 }}/>
      ) : (
        <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', fontSize:72, background:CAT_BG[l.category]||CAT_BG.Other, borderRadius:12, marginBottom:16, position:'relative' }}>
          {l.emoji || '🌱'}
          {l.is_boosted && <div style={{ position:'absolute', top:10, left:10, background:'#E8A020', color:'#fff', fontSize:9, fontWeight:800, padding:'3px 10px', borderRadius:8 }}>⚡ FEATURED</div>}
        </div>
      )}
      <div style={{ fontSize:30, fontWeight:900, color:'#2D6A2F' }}>${l.price}</div>
      <div style={{ fontSize:13, color:'#6D4C41', marginBottom:16 }}>per {l.unit}</div>
      {[
        { k:'Seller',    v: l.farmer_name + (l.farmer_verified ? ' ✓' : '') },
        { k:'Location',  v: '📍 ' + (l.location || l.province || 'Zimbabwe') },
        { k:'Available', v: l.quantity || 'Contact seller' },
        { k:'Category',  v: l.category },
      ].map(r => (
        <div key={r.k} style={{ display:'flex', gap:8, marginBottom:6, fontSize:13, color:'#6D4C41' }}>
          <strong style={{ color:'#3D2314', minWidth:80 }}>{r.k}:</strong>{r.v}
        </div>
      ))}
      {l.description && (
        <div style={{ marginTop:12, fontSize:13, color:'#6D4C41', lineHeight:1.6, background:'#F9F5EE', borderRadius:10, padding:12 }}>
          {l.description}
        </div>
      )}
      <div style={{ display:'flex', gap:10, marginTop:20 }}>
        <button
          onClick={() => window.open(waUrl, '_blank')}
          style={{ flex:1, background:'#25D366', color:'#fff', border:'none', padding:13, borderRadius:16, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}
        >
          💬 WhatsApp
        </button>
        <button
          onClick={() => { window.location.href = 'tel:+263' + (l.farmer_phone||'').replace(/\D/g,'') }}
          style={{ flex:1, background:'#2D6A2F', color:'#fff', border:'none', padding:13, borderRadius:16, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}
        >
          📞 Call
        </button>
      </div>
    </Modal>
  )
}

// ─── AI ADVISOR ───────────────────────────────────────────────────────────────
export function AdvisorModal({ onClose }) {
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    text: "Mangwanani! I'm your AI Farm Advisor. Ask me anything about crops, pests, prices, irrigation, or farming in Zimbabwe 🌱"
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs = [...msgs, { role:'user', text:msg }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const history = msgs.slice(-6).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }))
      const { data } = await API.post('/advisor/chat', { message: msg, history })
      setMsgs(m => [...m, { role:'assistant', text:data.reply }])
    } catch {
      setMsgs(m => [...m, { role:'assistant', text:'Sorry, connection issue. Please try again in a moment 🌿' }])
    }
    setLoading(false)
  }

  return (
    <Modal title="🤖 AI Farm Advisor" onClose={onClose}>
      {/* Chat */}
      <div style={{ background:'#f9f5ee', borderRadius:12, padding:12, minHeight:200, maxHeight:'38vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
            <div style={{ maxWidth:'82%', padding:'10px 14px', borderRadius:16, borderBottomLeftRadius:m.role!=='user'?4:16, borderBottomRightRadius:m.role==='user'?4:16, background:m.role==='user'?'#2D6A2F':'#fff', color:m.role==='user'?'#fff':'#3D2314', fontSize:13, lineHeight:1.5, boxShadow:m.role!=='user'?'0 2px 8px rgba(61,35,20,0.1)':'none' }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ padding:'10px 14px', borderRadius:16, background:'#fff', fontSize:13, color:'#6D4C41', fontStyle:'italic' }}>Thinking… 🌱</div>
          </div>
        )}
      </div>
      {/* Input */}
      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
        <input
          style={{ ...inp, flex:1, borderRadius:30, marginTop:0 }}
          placeholder="Ask about your crops, prices, pests…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={() => send()} disabled={loading} style={{ background:'#2D6A2F', color:'#fff', border:'none', padding:'10px 18px', borderRadius:30, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer' }}>
          Send
        </button>
      </div>
      {/* Quick questions */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {['March planting tips','Fall armyworm control','Maize prices now','Drip irrigation cost','GMB depots'].map(q => (
          <button key={q} onClick={() => send(q)} style={{ background:'#F5E6C8', color:'#6D4C41', border:'none', padding:'7px 12px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:700, cursor:'pointer' }}>
            {q}
          </button>
        ))}
      </div>
    </Modal>
  )
}
