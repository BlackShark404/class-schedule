<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop open" @click.self="close">
      <div class="modal-dialog" :class="`theme-${subject?.theme}`" role="dialog" aria-modal="true">
        <div class="modal-top-accent"></div>
        <div class="modal-body" v-if="subject && schedule">
          <div class="modal-header">
            <div class="modal-code-badge">
              <span>{{ subject.code }}</span>
              <span>·</span>
              <span>{{ subject.section || 'BSIT 4' }}</span>
            </div>
            <Tooltip>
              <TooltipTrigger as-child>
                <button class="modal-close-btn" @click="close" aria-label="Close">
                  <X :size="16" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" :side-offset="4">
                <span>Close (Esc)</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div class="modal-title">{{ subject.name }}</div>

          <div class="modal-mode-banner">
            <div class="modal-mode-label">
              <Globe v-if="isOnline" :size="12" />
              <School v-else :size="12" />
              <span>Class Delivery Mode</span>
            </div>
            <div class="mode-toggle" role="group" aria-label="Class Mode">
              <button type="button" class="mode-btn f2f" :class="{ active: !isOnline }" @click="handleSetMode('f2f')">
                <School :size="12" /><span>F2F</span>
              </button>
              <button type="button" class="mode-btn online" :class="{ active: isOnline }" @click="handleSetMode('online')">
                <Globe :size="12" /><span>Online</span>
              </button>
            </div>
          </div>

          <div class="modal-grid">
            <div class="modal-info-card full-width">
              <div class="modal-info-label"><User :size="14" /> Professor / Instructor</div>
              <div class="modal-info-value">{{ subject.instructor }}</div>
            </div>
            <div class="modal-info-card">
              <div class="modal-info-label"><CalendarDays :size="14" /> Day</div>
              <div class="modal-info-value">{{ schedule.dayFull }}</div>
            </div>
            <div class="modal-info-card">
              <div class="modal-info-label"><Clock :size="14" /> Time</div>
              <div class="modal-info-value">{{ schedule.time }} ({{ schedule.endHour - schedule.startHour }} hrs)</div>
            </div>
            <div class="modal-info-card">
              <div class="modal-info-label">
                <Video v-if="isOnline" :size="14" />
                <MapPin v-else :size="14" />
                Location
              </div>
              <div class="modal-info-value">
                <span v-if="isOnline" class="mode-tag-online"><Globe :size="13" /> Online ({{ schedule.room }})</span>
                <span v-else>{{ schedule.room }}</span>
              </div>
            </div>
            <div class="modal-info-card">
              <div class="modal-info-label"><Hourglass :size="14" /> Units & Type</div>
              <div class="modal-info-value">{{ subject.units }} Units · {{ subject.type || 'Lecture' }}</div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-action-btn secondary" @click="close">Close</button>
            <button class="modal-action-btn primary" @click="$emit('jumpToCards', subject.code, schedule.day); close()">
              View in Cards View →
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { X, Globe, School, User, CalendarDays, Clock, Video, MapPin, Hourglass } from '@lucide/vue'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { subjects } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'
import { toast } from 'vue-sonner'

const props = defineProps({
  subjectCode: String,
  day: String,
  isOpen: Boolean
})

const emit = defineEmits(['close', 'jumpToCards'])

const { getMode, setMode } = useSubjectModes()

const subject = computed(() => subjects.find(s => s.code === props.subjectCode))
const schedule = computed(() => {
  if (!subject.value) return null
  return subject.value.schedules.find(s => s.day === props.day) || subject.value.schedules[0]
})
const isOnline = computed(() => subject.value ? getMode(subject.value.code) === 'online' : false)

function handleSetMode(newMode) {
  if (!subject.value) return
  if (getMode(subject.value.code) === newMode) return
  setMode(subject.value.code, newMode)
  if (newMode === 'online') {
    toast(`Set to Online: ${subject.value.code}`, { description: 'Classes will be held virtually' })
  } else {
    toast(`Set to F2F: ${subject.value.code}`, { description: `Room ${schedule.value.room}` })
  }
}

function close() {
  emit('close')
  document.body.style.overflow = ''
}

function handleKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) close()
}

watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>
