'use client'

import { useTheme } from './providers/ThemeProvider'

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme()

  return (
    <div className="relative group">
      <button className="w-8 h-8 rounded-lg bg-bg-card border-2 border-accent text-accent hover:shadow-lg transition-theme flex items-center justify-center text-lg">
        🎨
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-secondary glass-effect-accent rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
        <div className="p-3 space-y-2">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              className={`w-full px-3 py-2 rounded-lg text-left font-medium transition-theme text-sm capitalize ${
                currentTheme === theme
                  ? 'bg-accent text-primary'
                  : 'bg-bg-card text-text-secondary hover:bg-accent hover:text-primary'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
