'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'cyber' | 'ocean' | 'forest' | 'sunset'

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

const allThemes: Theme[] = ['cyber', 'ocean', 'forest', 'sunset']

const themeVars: Record<Theme, Record<string, string>> = {
  cyber: {
    '--color-primary': '#070B14',
    '--color-secondary': '#0D1526',
    '--color-accent': '#00D4FF',
    '--color-accent-dark': '#0099BB',
    '--color-accent-light': '#66E8FF',
    '--color-text': '#E8F4FF',
    '--color-text-secondary': '#7A9BB5',
    '--color-bg-card': '#0F1929',
    '--color-border': '#1E3A5F',
    '--accent-rgb': '0, 212, 255',
  },
  ocean: {
    '--color-primary': '#050F11',
    '--color-secondary': '#081820',
    '--color-accent': '#00FFD4',
    '--color-accent-dark': '#00BFA0',
    '--color-accent-light': '#66FFE8',
    '--color-text': '#E0FFF8',
    '--color-text-secondary': '#6BA89A',
    '--color-bg-card': '#0A1E24',
    '--color-border': '#154A4A',
    '--accent-rgb': '0, 255, 212',
  },
  forest: {
    '--color-primary': '#040D08',
    '--color-secondary': '#081510',
    '--color-accent': '#00FF88',
    '--color-accent-dark': '#00CC6A',
    '--color-accent-light': '#66FFBB',
    '--color-text': '#E0FFE8',
    '--color-text-secondary': '#5A9B6A',
    '--color-bg-card': '#091A0F',
    '--color-border': '#1A4A2A',
    '--accent-rgb': '0, 255, 136',
  },
  sunset: {
    '--color-primary': '#100800',
    '--color-secondary': '#1A0E00',
    '--color-accent': '#FF8C00',
    '--color-accent-dark': '#CC6600',
    '--color-accent-light': '#FFB84D',
    '--color-text': '#FFF0E0',
    '--color-text-secondary': '#B5895A',
    '--color-bg-card': '#1E1000',
    '--color-border': '#5A3300',
    '--accent-rgb': '255, 140, 0',
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('cyber')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cc-theme') as Theme
      if (saved && allThemes.includes(saved)) {
        setCurrentTheme(saved)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const vars = themeVars[currentTheme]
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.setAttribute('data-theme', currentTheme)
    try {
      localStorage.setItem('cc-theme', currentTheme)
    } catch {}
  }, [currentTheme])

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setTheme: setCurrentTheme, themes: allThemes }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
