import { ThemeContext } from './useTheme'
import { useEffect, useState } from 'react'

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('neuron-theme')
    if (saved) return saved

    // Default to light, but could check prefers-color-scheme
    return 'light'
  })

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('neuron-theme', theme)
  }, [theme])

  const themes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' }
  ]

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}