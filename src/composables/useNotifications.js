import { ref, onMounted, onUnmounted } from 'vue'
import { subjects, dayShort, formatHour } from '../data/schedule.js'
import { useSubjectModes } from './useSubjectModes.js'

export function useNotifications() {
  const { getMode } = useSubjectModes()
  const enabled = ref(false)
  const notifiedClasses = new Set()
  let timer = null

  // Restore preference
  try {
    const pref = localStorage.getItem('notificationsEnabled')
    if (pref === 'true' && 'Notification' in window && Notification.permission === 'granted') {
      enabled.value = true
    }
  } catch (e) { /* noop */ }

  async function toggle() {
    if (!enabled.value) {
      if (!('Notification' in window)) return 'unsupported'
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        enabled.value = true
        try { localStorage.setItem('notificationsEnabled', 'true') } catch (e) { /* noop */ }
        return 'enabled'
      }
      return 'denied'
    } else {
      enabled.value = false
      try { localStorage.setItem('notificationsEnabled', 'false') } catch (e) { /* noop */ }
      return 'disabled'
    }
  }

  function sendNotification(title, options) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, options)
      }).catch(() => {
        try { new Notification(title, options) } catch (e) { /* noop */ }
      })
    } else if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, options) } catch (e) { /* noop */ }
    }
  }

  function checkReminders() {
    if (!enabled.value) return
    const now = new Date()
    const currentMin = now.getHours() * 60 + now.getMinutes()
    const todayCode = dayShort[now.getDay()]
    if (!todayCode) return

    subjects.forEach(sub => {
      const mode = getMode(sub.code)
      sub.schedules.forEach(sched => {
        if (sched.day !== todayCode) return
        const startMin = sched.startHour * 60 + (sched.startMin || 0)
        const diff = startMin - currentMin
        const key = `${sub.code}-${sched.startHour}`

        if (diff > 0 && diff <= 15 && !notifiedClasses.has(key)) {
          notifiedClasses.add(key)
          const isOnline = mode === 'online'
          const locText = isOnline ? '🌐 Online Class' : `📍 ${sched.room}`
          sendNotification(`${sub.code} · ${sub.name}`, {
            body: `Starts in ${diff} min (${sched.time}) · ${locText}`,
            icon: '/ctu-logo.png',
            badge: '/ctu-logo.png',
            tag: key,
            vibrate: [200, 100, 200],
            requireInteraction: false
          })
        }
      })
    })
  }

  onMounted(() => {
    timer = setInterval(checkReminders, 30000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { enabled, toggle }
}
