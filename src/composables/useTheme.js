import { ref, watch } from 'vue'

const isDark = ref(true)

// Initialize from localStorage
try {
  const saved = localStorage.getItem('theme')
  if (saved === 'light') isDark.value = false
} catch (e) { /* noop */ }

function applyTheme() {
  const html = document.documentElement
  const meta = document.querySelector('meta[name="theme-color"]')
  if (isDark.value) {
    html.classList.remove('light')
    if (meta) meta.content = '#0a0a0f'
  } else {
    html.classList.add('light')
    if (meta) meta.content = '#f5f5fa'
  }
}

watch(isDark, () => {
  applyTheme()
  try { localStorage.setItem('theme', isDark.value ? 'dark' : 'light') } catch (e) { /* noop */ }
}, { immediate: true })

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    return isDark.value ? 'dark' : 'light'
  }

  return { isDark, toggleTheme }
}
