import React, { useState, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import './Layout.css'

// Theme context so any child can access dark mode
export const ThemeContext = createContext({ dark: false, toggleDark: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export default function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(false)

  const isLoginPage = location.pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  const toggleDark = () => setDark(prev => !prev)

  // Pass dark prop to all children via cloneElement
  const childrenWithDark = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { dark })
    }
    return child
  })

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <div className={`layout ${dark ? 'layout--dark dark' : 'layout--light'}`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          dark={dark} 
        />
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          dark={dark}
          onToggleDark={toggleDark}
        />
        <main className="layout__main">
          {childrenWithDark}
        </main>
      </div>
    </ThemeContext.Provider>
  )
}
