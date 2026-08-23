<template>
  <div class="today-section">
    <!-- Weekend -->
    <template v-if="!todayCode">
      <div class="today-header">
        <div class="today-dot" style="background: var(--accent-5); box-shadow: 0 0 10px rgba(255, 234, 167, 0.5);"></div>
        <div class="today-label" style="color: var(--accent-5);">Weekend — No Classes</div>
      </div>
      <div class="no-class-today">Enjoy your weekend!</div>
    </template>

    <!-- Has classes today -->
    <template v-else-if="todaySubjects.length > 0">
      <div class="today-header">
        <div class="today-dot"></div>
        <div class="today-label">Today · {{ dayName }} · {{ todaySubjects.length }} class{{ todaySubjects.length > 1 ? 'es' : '' }}</div>
      </div>
      <ScheduleCard v-if="nextClass" :subject="nextClass" :schedule="nextClass.currentSchedule" />
    </template>

    <!-- No classes today -->
    <template v-else>
      <div class="today-header">
        <div class="today-dot"></div>
        <div class="today-label">Today · {{ dayName }}</div>
      </div>
      <div class="no-class-today">No classes today!</div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
