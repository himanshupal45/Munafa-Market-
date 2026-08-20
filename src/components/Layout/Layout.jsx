import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import './Layout.css'

export default function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(false)

  // Check if current route is login
  const isLoginPage = location.pathname === '/login'

  // Don't show sidebar/header on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className={`layout ${dark ? 'layout--dark' : 'layout--light'}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        dark={dark} 
      />
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}