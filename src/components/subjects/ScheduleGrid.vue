<template>
  <div class="schedule-grid">
    <ScheduleCard
      v-for="item in sortedSchedules"
      :key="`${item.subject.code}-${item.schedule.day}-${item.schedule.startHour}`"
      :subject="item.subject"
      :schedule="item.schedule"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { subjects, dayMap } from '../../data/schedule.js'
import ScheduleCard from './ScheduleCard.vue'

const props = defineProps({ filter: { type: String, default: 'all' } })

const sortedSchedules = computed(() => {
  const all = []
  subjects.forEach(sub => {
    sub.schedules.forEach(sched => {
      if (props.filter === 'all' || sched.day === props.filter) {
        all.push({ subject: sub, schedule: sched })
      }
    })
  })
  
  all.sort((a, b) => {
    const dayDiff = dayMap[a.schedule.day] - dayMap[b.schedule.day]
    if (dayDiff !== 0) return dayDiff
    
    const timeA = a.schedule.startHour * 60 + (a.schedule.startMin || 0)
    const timeB = b.schedule.startHour * 60 + (b.schedule.startMin || 0)
    return timeA - timeB
  })
  
  return all
})
</script>
