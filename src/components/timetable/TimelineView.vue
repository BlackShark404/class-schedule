<template>
  <div class="timetable-timeline-view active">
    <!-- Day selector bar -->
    <div class="timeline-day-selector">
      <button
        v-for="d in dayList"
        :key="d"
        class="timeline-day-btn"
        :class="{ active: selectedDay === d, 'is-today': d === todayCode }"
        @click="selectedDay = d"
      >
        <span class="day-btn-label">{{ dayAbbrev[d] }}</span>
        <span v-if="d === todayCode" class="day-btn-dot"></span>
      </button>
    </div>

    <div class="timeline-content">
      <!-- Empty State -->
      <div v-if="daySubjects.length === 0" class="no-class-card" style="margin-top: 8px;">
        <div class="no-class-icon-wrapper">
          <Sparkles :size="24" class="no-class-icon" />
        </div>
        <div class="no-class-content">
          <h3 class="no-class-title">No Classes on {{ dayLabels[selectedDay] || 'this day' }}</h3>
          <p class="no-class-desc">No subjects scheduled for this day. Enjoy your free time!</p>
        </div>
      </div>

      <!-- Timeline List -->
      <div v-else class="timeline-list">
        <div v-for="item in daySubjects" :key="`${item.code}-${item.schedule.day}`" class="timeline-item">
          <!-- Left Time Column -->
          <div class="timeline-time-rail">
            <div class="timeline-start-time">{{ formatHour(item.schedule.startHour, item.schedule.startMin) }}</div>
            <div class="timeline-duration-badge">{{ item.schedule.endHour - item.schedule.startHour }}h</div>
            <div class="timeline-line">
              <div class="timeline-line-dot" :class="`theme-${item.theme}`"></div>
            </div>
            <div class="timeline-end-time">{{ formatHour(item.schedule.endHour, item.schedule.endMin) }}</div>
          </div>

          <!-- Card -->
          <div
            class="timeline-card"
            :class="[`theme-${item.theme}`, { 'is-online': getMode(item.code) === 'online' }]"
            @click="$emit('openModal', item.code, item.schedule.day)"
            role="button"
            tabindex="0"
            title="Tap for full subject details"
          >
            <div class="timeline-card-top">
              <div class="timeline-code-group">
                <span class="timeline-card-code">{{ item.code }}</span>
                <span v-if="item.type" class="timeline-type-tag">{{ item.type }}</span>
              </div>
              <div class="timeline-badges-group">
                <div class="timetable-mode-badge" :class="getMode(item.code) === 'online' ? 'online' : 'f2f'">
                  <template v-if="getMode(item.code) === 'online'">
                    <Globe :size="10" /> <span>Online</span>
                  </template>
                  <template v-else>
                    <School :size="10" /> <span>F2F</span>
                  </template>
                </div>
                <span class="timeline-units-pill">{{ item.units }} Units</span>
              </div>
            </div>

            <div class="timeline-card-title">{{ item.name }}</div>

            <div class="timeline-card-meta">
              <div class="card-meta-item card-prof-item">
                <User :size="14" />
                <span>{{ item.instructor }}</span>
              </div>
              <div class="card-meta-item">
                <Clock :size="14" />
                <span>{{ item.schedule.time }}</span>
              </div>
              <div class="card-meta-item">
                <Video v-if="getMode(item.code) === 'online'" :size="14" />
                <MapPin v-else :size="14" />
                <span v-if="getMode(item.code) === 'online'" class="mode-tag-online">Online ({{ item.schedule.room }})</span>
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
import { Globe, School, User, Clock, Video, MapPin, Sparkles } from '@lucide/vue'
import { subjects, dayList, dayAbbrev, dayLabels, dayShort, formatHour } from '../../data/schedule.js'
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
