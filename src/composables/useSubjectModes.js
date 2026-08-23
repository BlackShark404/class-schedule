import { ref, computed } from 'vue'
import { subjects } from '../data/schedule.js'

function loadModes() {
  try {
    const data = localStorage.getItem('subject_modes')
    return data ? JSON.parse(data) : {}
  } catch (e) {
    return {}
  }
}

function saveModes(modes) {
  try {
    localStorage.setItem('subject_modes', JSON.stringify(modes))
  } catch (e) { /* noop */ }
}

const modes = ref(loadModes())

export function useSubjectModes() {
  function getMode(code) {
    return modes.value[code] || 'f2f'
  }

  function setMode(code, mode) {
    modes.value = { ...modes.value, [code]: mode }
    saveModes(modes.value)
  }

  function setAllModes(mode) {
    const newModes = {}
    subjects.forEach(sub => { newModes[sub.code] = mode })
    modes.value = newModes
    saveModes(modes.value)
  }

  const summary = computed(() => {
    let onlineCount = 0
    let f2fCount = 0
    subjects.forEach(sub => {
      if ((modes.value[sub.code] || 'f2f') === 'online') onlineCount++
      else f2fCount++
    })
    return { onlineCount, f2fCount }
  })

  return { modes, getMode, setMode, setAllModes, summary }
}
