import { ref, onMounted, onUnmounted } from 'vue'
import { subjects, dayShort, formatHour } from '../data/schedule.js'
import { useSubjectModes } from './useSubjectModes.js'

export function useCountdown() {
  const { getMode } = useSubjectModes()
  const state = ref('free') // 'ongoing' | 'upcoming' | 'free' | 'done'
  const currentClass = ref(null)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const detail = ref('')
  let timer = null

  function getTodaySchedules() {
    const today = new Date().getDay()
    const todayCode = dayShort[today]
    if (!todayCode) return []

    const result = []
    subjects.forEach(sub => {
      const mode = getMode(sub.code)
      sub.schedules.forEach(sched => {
        if (sched.day === todayCode) {
          result.push({
            code: sub.code,
            name: sub.name,
            instructor: sub.instructor,
            room: sched.room,
            time: sched.time,
            startHour: sched.startHour,
            startMin: sched.startMin || 0,
            endHour: sched.endHour,
            endMin: sched.endMin || 0,
            theme: sub.theme,
            mode
          })
        }
      })
    })
    return result.sort((a, b) => (a.startHour * 60 + a.startMin) - (b.startHour * 60 + b.startMin))
  }

  function update() {
    const now = new Date()
    const currentMin = now.getHours() * 60 + now.getMinutes()
    const todaySchedules = getTodaySchedules()

    if (todaySchedules.length === 0) {
      state.value = 'free'
      currentClass.value = null
      return
    }

    // Check for ongoing class
    const ongoing = todaySchedules.find(s => {
      const start = s.startHour * 60 + s.startMin
      const end = s.endHour * 60 + s.endMin
      return currentMin >= start && currentMin < end
    })

    if (ongoing) {
      state.value = 'ongoing'
      currentClass.value = ongoing
      const endMin = ongoing.endHour * 60 + ongoing.endMin
      const diff = endMin - currentMin
      hours.value = Math.floor(diff / 60)
      minutes.value = diff % 60
      seconds.value = 59 - now.getSeconds()
      const isOnline = ongoing.mode === 'online'
      detail.value = `${ongoing.code} · ${ongoing.instructor} · ${isOnline ? '🌐 Online (' + ongoing.room + ')' : ongoing.room} · Ends at ${formatHour(ongoing.endHour, ongoing.endMin)}`
      return
    }

    // Check for next upcoming class
    const upcoming = todaySchedules.find(s => {
      const start = s.startHour * 60 + s.startMin
      return currentMin < start
    })

    if (upcoming) {
      state.value = 'upcoming'
      currentClass.value = upcoming
      const startMin = upcoming.startHour * 60 + upcoming.startMin
      const diff = startMin - currentMin
      const s = now.getSeconds() > 0 ? 60 - now.getSeconds() : 0
      let m = diff % 60 - (now.getSeconds() > 0 ? 1 : 0)
      let h = Math.floor(diff / 60)
      if (m < 0) { m += 60; h -= 1 }
      hours.value = Math.max(0, h)
      minutes.value = Math.max(0, m)
      seconds.value = s
      const isOnline = upcoming.mode === 'online'
      detail.value = `${upcoming.code} · ${upcoming.instructor} · ${isOnline ? '🌐 Online (' + upcoming.room + ')' : upcoming.room} · Starts at ${formatHour(upcoming.startHour, upcoming.startMin)}`
      return
    }

    // All classes done
    state.value = 'done'
    currentClass.value = null
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { state, currentClass, hours, minutes, seconds, detail, update, getTodaySchedules }
}
