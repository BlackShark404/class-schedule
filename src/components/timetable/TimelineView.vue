<template>
  <div class="timetable-timeline-view active">
    <div class="timeline-day-selector">
      <button
        v-for="d in dayList" :key="d"
        class="timeline-day-btn"
        :class="{ active: selectedDay === d, 'is-today': d === todayCode }"
        @click="selectedDay = d"
      >{{ dayAbbrev[d] }}</button>
    </div>

    <div class="timeline-content">
      <!-- Empty -->
      <div v-if="daySubjects.length === 0" class="timeline-empty">
        <div style="font-size: 28px; margin-bottom: 8px;">🎉</div>
        <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 4px;">No classes scheduled for this day</div>
        <div style="font-size: 12px;">Take a well-deserved break!</div>
      </div>

      <!-- Timeline -->
      <div v-else class="timeline-list">
        <div v-for="item in daySubjects" :key="`${item.code}-${item.schedule.day}`" class="timeline-item">
          <div class="timeline-time-rail">
            <div class="timeline-start-time">{{ formatHour(item.schedule.startHour, item.schedule.startMin) }}</div>
            <div class="timeline-line"><div class="timeline-line-dot"></div></div>
            <div class="timeline-end-time">{{ formatHour(item.schedule.endHour, item.schedule.endMin) }}</div>
          </div>
          <div
            class="timeline-card"
            :class="[`theme-${item.theme}`, { 'is-online': getMode(item.code) === 'online' }]"
            @click="$emit('openModal', item.code, item.schedule.day)"
            role="button"
            tabindex="0"
            title="Tap for full subject details"
          >
            <div class="timeline-card-top">
              <div class="timeline-card-code">{{ item.code }}</div>
              <div class="timetable-mode-badge" :class="getMode(item.code) === 'online' ? 'online' : 'f2f'">
                <template v-if="getMode(item.code) === 'online'">
                  <Globe :size="9" /> Online
                </template>
                <template v-else>
                  <School :size="9" /> F2F
                </template>
              </div>
            </div>
            <div class="timeline-card-title">{{ item.name }}</div>
            <div class="timeline-card-meta">
              <div class="card-meta-item card-prof-item">
                <User :size="14" /><span>{{ item.instructor }}</span>
              </div>
              <div class="card-meta-item">
                <Clock :size="14" />
                <span>{{ item.schedule.endHour - item.schedule.startHour }} hr{{ (item.schedule.endHour - item.schedule.startHour) > 1 ? 's' : '' }} ({{ item.units }} Units · {{ item.type || 'Lecture' }})</span>
              </div>
              <div class="card-meta-item">
                <Video v-if="getMode(item.code) === 'online'" :size="14" />
                <MapPin v-else :size="14" />
                <span v-if="getMode(item.code) === 'online'"><span class="mode-tag-online">Online ({{ item.schedule.room }})</span></span>
                <span v-else>{{ item.schedule.room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Globe, School, User, Clock, Video, MapPin } from '@lucide/vue'
import { subjects, dayList, dayAbbrev, dayShort, formatHour } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'

defineEmits(['openModal'])

const { getMode } = useSubjectModes()
const todayCode = dayShort[new Date().getDay()]
const selectedDay = ref(todayCode || 'M')

const daySubjects = computed(() => {
  const result = []
  subjects.forEach(sub => {
    sub.schedules.forEach(sched => {
      if (sched.day === selectedDay.value) {
        result.push({ ...sub, schedule: sched })
      }
    })
  })
  return result.sort((a, b) => (a.schedule.startHour * 60 + (a.schedule.startMin || 0)) - (b.schedule.startHour * 60 + (b.schedule.startMin || 0)))
})
</script>
