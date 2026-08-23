<template>
  <div class="schedule-grid">
    <template v-for="sub in subjects" :key="sub.code">
      <ScheduleCard
        v-for="sched in filteredSchedules(sub)"
        :key="`${sub.code}-${sched.day}`"
        :subject="sub"
        :schedule="sched"
      />
    </template>
  </div>
</template>

<script setup>
import { subjects } from '../../data/schedule.js'
import ScheduleCard from './ScheduleCard.vue'

const props = defineProps({ filter: { type: String, default: 'all' } })

function filteredSchedules(sub) {
  if (props.filter === 'all') return sub.schedules
  return sub.schedules.filter(s => s.day === props.filter)
}
</script>
