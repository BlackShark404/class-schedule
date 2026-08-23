<template>
  <div class="timetable-grid-container">
    <!-- Mobile scroll hint -->
    <div class="timetable-scroll-hint">
      <div class="hint-content">
        <ArrowLeftRight :size="13" class="hint-icon" />
        <span>Swipe sideways to explore all days</span>
      </div>
      <span class="hint-days-pill">Mon – Fri</span>
    </div>

    <div
      class="timetable-wrapper"
      ref="scrollContainer"
      :class="{ 'is-scrolled-x': isScrolledX }"
      @scroll.passive="onScroll"
    >
      <table class="timetable">
        <thead>
          <tr>
            <th class="time-header-cell">Time</th>
            <th
              v-for="day in days"
              :key="day"
              :class="['day-header-cell', { 'is-today': day === todayDayCode }]"
            >
              <div class="day-header-content">
                <span class="day-header-name">{{ dayAbbrev[day] }}</span>
                <span v-if="day === todayDayCode" class="today-indicator">Today</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in hours" :key="hour">
            <td class="time-cell">{{ formatTimeLabel(hour) }}</td>
            <template v-for="day in days" :key="day">
              <td
                v-if="getBlock(hour, day)"
                :rowspan="getBlock(hour, day).rowSpan"
                :class="['grid-cell', { 'is-today-col': day === todayDayCode }]"
              >
                <div
                  class="timetable-block"
                  :class="[getBlock(hour, day).blockClass, { 'is-online': getMode(getBlock(hour, day).code) === 'online' }]"
                  @click="$emit('openModal', getBlock(hour, day).code, day)"
                  role="button"
                  tabindex="0"
                  title="Tap to view full class details"
                >
                  <div class="block-top-row">
                    <span class="block-code" :title="getBlock(hour, day).code">{{ getBlock(hour, day).code }}</span>
                    <div
                      class="timetable-mode-badge"
                      :class="getMode(getBlock(hour, day).code) === 'online' ? 'online' : 'f2f'"
                      :title="getMode(getBlock(hour, day).code) === 'online' ? 'Online Class' : 'Face-to-Face Class'"
                    >
                      <template v-if="getMode(getBlock(hour, day).code) === 'online'">
                        <Globe :size="10" /> <span class="badge-mode-text">Online</span>
                      </template>
                      <template v-else>
                        <School :size="10" /> <span class="badge-mode-text">F2F</span>
                      </template>
                    </div>
                  </div>
                  <div class="block-name">{{ getBlock(hour, day).name }}</div>
                  <div class="block-prof">{{ getBlock(hour, day).instructor }}</div>
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
              <td
                v-else-if="!isOccupied(hour, day)"
                :class="['grid-cell empty-cell', { 'is-today-col': day === todayDayCode }]"
              ></td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Globe, School, Video, MapPin, ArrowLeftRight } from '@lucide/vue'
import { subjects, dayList, dayAbbrev, dayShort } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'

defineEmits(['openModal'])

const { getMode } = useSubjectModes()
const days = dayList
const hours = Array.from({ length: 9 }, (_, i) => 7 + i) // 7 AM to 3 PM (ends at 4 PM)

const scrollContainer = ref(null)
const isScrolledX = ref(false)

function onScroll(e) {
  isScrolledX.value = (e.target.scrollLeft > 6)
}

onMounted(() => {
  if (scrollContainer.value) {
    isScrolledX.value = scrollContainer.value.scrollLeft > 6
  }
})

// Today's day code
const todayDayCode = computed(() => {
  const dayNum = new Date().getDay()
  return dayShort[dayNum] || null
})

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
