import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#3D2314',
          color: '#fff',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          borderRadius: 30,
          padding: '12px 24px',
        },
        duration: 2800,
      }}
    />
  </BrowserRouter>
)
