import { useTheme } from '../hooks/useTheme'

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme()

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="nb-theme-selector"
    >
      {themes.map((t) => (
        <option key={t.value} value={t.value}>
          {t.name}
        </option>
      ))}
    </select>
  )
}

export default ThemeSelector