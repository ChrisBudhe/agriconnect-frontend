import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  { art:'🌾', title:'Sell Your Produce', sub:'List crops, livestock & dairy directly to buyers across Zimbabwe. No middleman.' },
  { art:'🤝', title:'Join the Community', sub:'Share tips, ask questions & learn from thousands of Zimbabwean farmers.' },
  { art:'⚡', title:'Boost & Advertise',  sub:'Reach more buyers by promoting your listings. Pay easily via EcoCash.' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const nav = useNavigate()

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#1a4520 0%,#0a1f0c 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', gap:24 }}>
      <style>{`@keyframes si{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <div style={{ textAlign:'center', animation:'si 0.4s ease' }} key={step}>
        <div style={{ fontSize:90, marginBottom:16, filter:'drop-shadow(0 4px 24px rgba(139,195,74,0.3))' }}>{SLIDES[step].art}</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:28, marginBottom:12 }}>{SLIDES[step].title}</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, lineHeight:1.6, maxWidth:300 }}>{SLIDES[step].sub}</p>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        {SLIDES.map((_, i) => <div key={i} style={{ width:i===step?24:8, height:8, borderRadius:4, background:i===step?'#8BC34A':'rgba(255,255,255,0.25)', transition:'all 0.3s' }}/>)}
      </div>
      <div style={{ width:'100%', maxWidth:320, display:'flex', flexDirection:'column', gap:10 }}>
        <button
          onClick={() => step < 2 ? setStep(s=>s+1) : nav('/register')}
          style={{ background:'linear-gradient(135deg,#4CAF50,#2D6A2F)', color:'#fff', border:'none', padding:'14px 24px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(45,106,47,0.35)' }}
        >
          {step < 2 ? 'Continue →' : 'Get Started →'}
        </button>
        <button onClick={() => nav('/login')} style={{ background:'transparent', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.2)', padding:'12px', borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:14, cursor:'pointer' }}>
          Already have an account? Log in
        </button>
      </div>
    </div>
  )
}
