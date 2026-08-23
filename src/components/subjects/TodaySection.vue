<template>
  <div class="today-section">
    <!-- Weekend -->
    <template v-if="!todayCode">
      <div class="today-header">
        <div class="today-dot" style="background: var(--accent-5); box-shadow: 0 0 10px rgba(255, 234, 167, 0.5);"></div>
        <div class="today-label" style="color: var(--accent-5);">Weekend · No Classes</div>
      </div>
      <div class="no-class-card">
        <div class="no-class-icon-wrapper">
          <Coffee :size="24" class="no-class-icon" />
        </div>
        <div class="no-class-content">
          <h3 class="no-class-title">Weekend Rest & Recharge</h3>
          <p class="no-class-desc">
            No classes scheduled today. Enjoy your break! Next class starts on <strong class="text-primary-highlight">Monday at 7:00 AM</strong>.
          </p>
          <div class="no-class-badge">
            <Calendar :size="12" />
            <span>Next: PC 4112 · Mon 7:00 AM (ST 302)</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Has classes today -->
    <template v-else-if="todaySubjects.length > 0">
      <div class="today-header">
        <div class="today-dot"></div>
        <div class="today-label">Today · {{ dayName }} · {{ todaySubjects.length }} class{{ todaySubjects.length > 1 ? 'es' : '' }}</div>
      </div>
      <ScheduleCard v-if="nextClass" :subject="nextClass" :schedule="nextClass.currentSchedule" />
    </template>

    <!-- Weekday with No classes -->
    <template v-else>
      <div class="today-header">
        <div class="today-dot"></div>
        <div class="today-label">Today · {{ dayName }}</div>
      </div>
      <div class="no-class-card">
        <div class="no-class-icon-wrapper">
          <Sparkles :size="24" class="no-class-icon" />
        </div>
        <div class="no-class-content">
          <h3 class="no-class-title">No Classes Scheduled Today</h3>
          <p class="no-class-desc">You have no classes today. Take advantage of your free time!</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Coffee, Sparkles, Calendar } from '@lucide/vue'
import { subjects, dayShort, dayNames } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'
import ScheduleCard from './ScheduleCard.vue'

const { getMode } = useSubjectModes()

const today = new Date().getDay()
const todayCode = computed(() => dayShort[today])
const dayName = computed(() => dayNames[today])

const todaySubjects = computed(() => {
  if (!todayCode.value) return []
  const result = []
  subjects.forEach(sub => {
    sub.schedules.forEach(sched => {
      if (sched.day === todayCode.value) {
        result.push({ ...sub, currentSchedule: sched, mode: getMode(sub.code) })
      }
    })
  })
  return result.sort((a, b) => a.currentSchedule.startHour - b.currentSchedule.startHour)
})

const nextClass = computed(() => {
  const now = new Date()
  return todaySubjects.value.find(s => s.currentSchedule.endHour > now.getHours()) || todaySubjects.value[0]
})
</script>
