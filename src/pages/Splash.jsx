export default function Splash() {
  return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#1a4520 0%,#0d2210 50%,#3D2314 100%)', gap:8 }}>
      <style>{`@keyframes load{to{width:100%}}`}</style>
      <span style={{ fontSize:72, filter:'drop-shadow(0 4px 20px rgba(139,195,74,0.5))' }}>🌿</span>
      <h1 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:40, fontWeight:900, lineHeight:1 }}>AgriConnect</h1>
      <p style={{ color:'#8BC34A', fontSize:20, fontWeight:700, letterSpacing:4 }}>ZIMBABWE</p>
      <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginTop:4 }}>Connecting Farmers. Growing Futures.</p>
      <div style={{ width:160, height:3, background:'rgba(255,255,255,0.1)', borderRadius:2, marginTop:24, overflow:'hidden' }}>
        <div style={{ height:'100%', width:0, background:'linear-gradient(90deg,#8BC34A,#E8A020)', borderRadius:2, animation:'load 1.5s ease forwards' }}/>
      </div>
    </div>
  )
}
