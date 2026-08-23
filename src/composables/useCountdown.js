import { ref, onMounted, onUnmounted } from 'vue'
import { subjects, dayShort, dayNames, formatHour } from '../data/schedule.js'
import { useSubjectModes } from './useSubjectModes.js'

export function useCountdown() {
  const { getMode } = useSubjectModes()
  const state = ref('upcoming') // 'ongoing' | 'upcoming'
  const statusLabel = ref('Up Next')
  const currentClass = ref(null)
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const detail = ref('')
  let timer = null

  function getNextClassInfo() {
    const now = new Date()
    const currentDay = now.getDay()

    for (let offset = 0; offset <= 7; offset++) {
      const targetDayIndex = (currentDay + offset) % 7
      const targetDayCode = dayShort[targetDayIndex]
      if (!targetDayCode) continue

      const dayClasses = []
      subjects.forEach(sub => {
        const mode = getMode(sub.code)
        sub.schedules.forEach(sched => {
          if (sched.day === targetDayCode) {
            dayClasses.push({
              code: sub.code,
              name: sub.name,
              instructor: sub.instructor,
              room: sched.room,
              time: sched.time,
              startHour: sched.startHour,
              startMin: sched.startMin || 0,
              endHour: sched.endHour,
              endMin: sched.endMin || 0,
              day: sched.day,
              dayFull: sched.dayFull,
              theme: sub.theme,
              mode
            })
          }
        })
      })

      dayClasses.sort((a, b) => (a.startHour * 60 + a.startMin) - (b.startHour * 60 + b.startMin))

      for (const item of dayClasses) {
        const targetDate = new Date(now)
        targetDate.setDate(now.getDate() + offset)
        targetDate.setHours(item.startHour, item.startMin, 0, 0)

        const endDate = new Date(now)
        endDate.setDate(now.getDate() + offset)
        endDate.setHours(item.endHour, item.endMin, 0, 0)

        if (offset === 0) {
          // Today: check if class is currently in session
          if (now >= targetDate && now < endDate) {
            return {
              type: 'ongoing',
              item,
              targetTime: endDate,
              statusLabel: 'In Progress',
              dayOffset: 0
            }
          }
          // Today: check if class is coming up later today
          if (now < targetDate) {
            return {
              type: 'upcoming',
              item,
              targetTime: targetDate,
              statusLabel: 'Up Next · Today',
              dayOffset: 0
            }
          }
        } else {
          // Future upcoming day
          const label = offset === 1 ? 'Up Next · Tomorrow' : `Up Next · ${item.dayFull}`
          return {
            type: 'upcoming',
            item,
            targetTime: targetDate,
            statusLabel: label,
            dayOffset: offset
          }
        }
      }
    }
    return null
  }

  function update() {
    const nextInfo = getNextClassInfo()
    if (!nextInfo) return

    const now = new Date()
    const diffMs = Math.max(0, nextInfo.targetTime.getTime() - now.getTime())
    const totalSec = Math.floor(diffMs / 1000)

    days.value = Math.floor(totalSec / 86400)
    hours.value = Math.floor((totalSec % 86400) / 3600)
    minutes.value = Math.floor((totalSec % 3600) / 60)
    seconds.value = totalSec % 60

    state.value = nextInfo.type
    statusLabel.value = nextInfo.statusLabel
    currentClass.value = nextInfo.item

    const isOnline = nextInfo.item.mode === 'online'
    const locHtml = isOnline
      ? `<span class="mode-tag-online">Online (${nextInfo.item.room})</span>`
      : nextInfo.item.room

    if (nextInfo.type === 'ongoing') {
      detail.value = `${nextInfo.item.code} · ${nextInfo.item.instructor} · ${locHtml} · Ends at ${formatHour(nextInfo.item.endHour, nextInfo.item.endMin)}`
    } else {
      const dayPrefix = nextInfo.dayOffset === 0 ? 'Starts today at' : `Starts ${nextInfo.item.dayFull} at`
      detail.value = `${nextInfo.item.code} · ${nextInfo.item.instructor} · ${locHtml} · ${dayPrefix} ${formatHour(nextInfo.item.startHour, nextInfo.item.startMin)}`
    }
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { state, statusLabel, currentClass, days, hours, minutes, seconds, detail, update }
}
