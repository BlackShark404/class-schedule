<template>
  <div class="timetable-wrapper">
    <table class="timetable">
      <thead>
        <tr>
          <th>Time</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hour in hours" :key="hour">
          <td>{{ formatTimeLabel(hour) }}</td>
          <template v-for="day in days" :key="day">
            <td v-if="getBlock(hour, day)" :rowspan="getBlock(hour, day).rowSpan">
              <div
                class="timetable-block"
                :class="[getBlock(hour, day).blockClass, { 'is-online': getMode(getBlock(hour, day).code) === 'online' }]"
                @click="$emit('openModal', getBlock(hour, day).code, day)"
                role="button"
                tabindex="0"
                title="Tap to view full class details"
              >
                <div class="block-code">{{ getBlock(hour, day).code }}</div>
                <div class="block-name">{{ getBlock(hour, day).name }}</div>
                <div class="block-prof">{{ getBlock(hour, day).instructor }}</div>
                <div class="timetable-mode-badge" :class="getMode(getBlock(hour, day).code) === 'online' ? 'online' : 'f2f'">
                  <template v-if="getMode(getBlock(hour, day).code) === 'online'">
                    <Globe :size="9" /> Online
                  </template>
                  <template v-else>
                    <School :size="9" /> F2F
                  </template>
                </div>
                <div class="block-room">
                  <template v-if="getMode(getBlock(hour, day).code) === 'online'">
                    <Video :size="10" /> Online
                  </template>
                  <template v-else>
                    <MapPin :size="10" /> {{ getBlock(hour, day).room }}
                  </template>
                </div>
              </div>
            </td>
            <td v-else-if="!isOccupied(hour, day)"></td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Globe, School, Video, MapPin } from '@lucide/vue'
import { subjects, dayList } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'

defineEmits(['openModal'])

const { getMode } = useSubjectModes()
const days = dayList
const hours = Array.from({ length: 9 }, (_, i) => 7 + i) // 7 AM to 3 PM

// Pre-compute blocks and occupied cells
const blocks = computed(() => {
  const b = {}
  subjects.forEach(sub => {
    sub.schedules.forEach(sched => {
      const key = `${sched.startHour}-${sched.day}`
      b[key] = {
        code: sub.code,
        name: sub.name,
        instructor: sub.instructor,
        room: sched.room,
        blockClass: sub.blockClass,
        rowSpan: sched.endHour - sched.startHour,
        startHour: sched.startHour,
        endHour: sched.endHour
      }
    })
  })
  return b
})

const occupied = computed(() => {
  const o = {}
  subjects.forEach(sub => {
    sub.schedules.forEach(sched => {
      for (let h = sched.startHour; h < sched.endHour; h++) {
        o[`${h}-${sched.day}`] = true
      }
    })
  })
  return o
})

function getBlock(hour, day) {
  return blocks.value[`${hour}-${day}`] || null
}

function isOccupied(hour, day) {
  return occupied.value[`${hour}-${day}`] || false
}

function formatTimeLabel(hour) {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}
</script>
