import { useState, useEffect, useCallback } from 'react'
import { API } from '../store'
import ListingCard from '../components/ListingCard.jsx'
import { AddListingModal, ListingDetailModal } from '../components/Modals.jsx'

const CATS = ['All','Grains','Vegetables','Fruits','Livestock','Dairy','Poultry']
const CAT_ICONS = { All:'🌾', Grains:'🌽', Vegetables:'🥦', Fruits:'🍎', Livestock:'🐄', Dairy:'🥛', Poultry:'🐔' }

export default function Market() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState(null)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 40 }
      if (cat !== 'All') params.category = cat
      if (search.trim()) params.search = search.trim()
      const { data } = await API.get('/listings', { params })
      setListings(data.listings)
    } catch {}
    setLoading(false)
  }, [cat, search])

  useEffect(() => {
    const t = setTimeout(fetchListings, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchListings, search])

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#fdf0d5,#fff8ee)', padding:'16px 16px 12px', flexShrink:0 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#C8860A', fontWeight:700 }}>🛒 Marketplace</div>
        <div style={{ fontSize:12, color:'#6D4C41', opacity:.7, marginTop:2 }}>Buy & sell directly · USD & ZiG</div>
        <input
          style={{ width:'100%', padding:'11px 16px', border:'1.5px solid #e0d5c5', borderRadius:30, fontFamily:"'Nunito',sans-serif", fontSize:13, color:'#3D2314', background:'#fff', outline:'none', marginTop:12 }}
          placeholder="🔍  Search produce, location, farmer name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category strip */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'12px 16px', scrollbarWidth:'none', flexShrink:0 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding:'7px 16px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700, whiteSpace:'nowrap', cursor:'pointer', border:'1.5px solid', borderColor:cat===c?'#2D6A2F':'#e0d5c5', background:cat===c?'#2D6A2F':'#fff', color:cat===c?'#fff':'#6D4C41', flexShrink:0 }}>
            {CAT_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px 90px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#bbb' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🌾</div>
            <div style={{ fontSize:13 }}>Loading listings…</div>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign:'center', padding:48 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌱</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#3D2314', marginBottom:8 }}>
              {search ? `No results for "${search}"` : cat !== 'All' ? `No ${cat} listings yet` : 'No listings yet'}
            </div>
            <div style={{ fontSize:13, color:'#6D4C41', lineHeight:1.6, marginBottom:20 }}>
              {search ? 'Try a different search term or category.' : 'Be the first farmer to post in this category!'}
            </div>
            {!search && (
              <button onClick={() => setShowAdd(true)} style={{ background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'12px 28px', borderRadius:20, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>
                + Post Your First Listing
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, paddingTop:4 }}>
            {listings.map(l => <ListingCard key={l.id} listing={l} onClick={() => setDetail(l)} />)}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{ position:'fixed', bottom:72, right:20, background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'14px 22px', borderRadius:30, fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 20px rgba(45,106,47,0.4)', zIndex:50 }}>
        + Sell
      </button>

      {showAdd && (
        <AddListingModal
          onClose={() => setShowAdd(false)}
          onSuccess={(l) => { setListings(ls => [l, ...ls]); setShowAdd(false) }}
        />
      )}
      {detail && <ListingDetailModal listing={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
