// ─── LISTING CARD ─────────────────────────────────────────────────────────────
const CAT_BG = { Grains:'linear-gradient(135deg,#fff9c4,#f9a825)', Vegetables:'linear-gradient(135deg,#e8f5e9,#a5d6a7)', Fruits:'linear-gradient(135deg,#fce4ec,#f48fb1)', Livestock:'linear-gradient(135deg,#efebe9,#bcaaa4)', Dairy:'linear-gradient(135deg,#e3f2fd,#90caf9)', Poultry:'linear-gradient(135deg,#fff3e0,#ffcc80)', Other:'linear-gradient(135deg,#f5f5f5,#e0e0e0)' }

export function ListingCard({ listing: l, onClick, compact }) {
  const bg = CAT_BG[l.category] || CAT_BG.Other

  if (compact) return (
    <div onClick={onClick} style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(61,35,20,0.1)', cursor:'pointer' }}>
      <div style={{ height:88, display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, background:bg, position:'relative' }}>
        {l.emoji || '🌱'}
        {l.is_boosted && <div style={{ position:'absolute', top:6, left:6, background:'#E8A020', color:'#fff', fontSize:8, fontWeight:800, padding:'2px 6px', borderRadius:6 }}>⚡ TOP</div>}
      </div>
      <div style={{ padding:'8px 10px 10px' }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#3D2314' }}>{l.title}</div>
        <div style={{ fontSize:10, color:'#6D4C41', opacity:.65 }}>{l.farmer_name}</div>
        <div style={{ fontSize:13, fontWeight:800, color:'#2D6A2F', marginTop:4 }}>${l.price} <span style={{ fontSize:10, fontWeight:400, color:'#888' }}>{l.unit}</span></div>
      </div>
    </div>
  )

  return (
    <div onClick={onClick} style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(61,35,20,0.1)', cursor:'pointer' }}>
      <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, background:bg, position:'relative' }}>
        {l.emoji || '🌱'}
        {l.is_boosted && <div style={{ position:'absolute', top:8, right:8, background:'#E8A020', color:'#fff', fontSize:8, fontWeight:800, padding:'2px 6px', borderRadius:6 }}>⚡ TOP</div>}
      </div>
      <div style={{ padding:10 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#3D2314' }}>{l.title}</div>
        <div style={{ fontSize:10, color:'#6D4C41', opacity:.65, marginTop:1 }}>📍 {l.location || l.province}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'#2D6A2F' }}>${l.price}</div>
            <div style={{ fontSize:9, color:'#6D4C41', opacity:.6 }}>{l.unit}</div>
          </div>
          <div onClick={e => { e.stopPropagation(); window.open(`https://wa.me/${l.farmer_phone?.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi! I saw your *${l.title}* on AgriConnect Zimbabwe. Is it available?`)}`) }}
            style={{ width:30, height:30, background:'#25D366', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' }}>💬</div>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
