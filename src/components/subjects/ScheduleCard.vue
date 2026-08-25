<template>
  <div class="schedule-card" :class="[`theme-${subject.theme}`, `mode-${mode}`]">
    <div class="card-accent"></div>
    <div class="card-content">
      <div class="card-main">
        <div class="card-top-row">
          <div class="card-code">{{ subject.code }}{{ typeLabel }}</div>
          <div class="mode-toggle" role="group" aria-label="Class Mode">
            <Tooltip>
              <TooltipTrigger as-child>
                <button type="button" class="mode-btn f2f" :class="{ active: mode === 'f2f' }"
                  @click.stop="handleSetMode('f2f')" aria-label="Set to Face-to-Face">
                  <School :size="12" /><span>F2F</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" :side-offset="6">
                <span>Set to Face-to-Face</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button type="button" class="mode-btn online" :class="{ active: mode === 'online' }"
                  @click.stop="handleSetMode('online')" aria-label="Set to Online">
                  <Globe :size="12" /><span>Online</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" :side-offset="6">
                <span>Set to Online</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div class="card-title">{{ subject.name }}</div>
        <div class="card-meta">
          <div class="card-meta-item card-prof-item">
            <User :size="14" />
            <span>{{ subject.instructor }}</span>
          </div>
          <div class="card-meta-item">
            <Clock :size="14" />
            <span>{{ schedule.time }}</span>
          </div>
          <div class="card-meta-item">
            <CalendarDays :size="14" />
            <span>{{ schedule.dayFull }}</span>
          </div>
          <div v-if="mode === 'f2f'" class="card-meta-item">
            <MapPin :size="14" />
            <span>{{ schedule.room }}</span>
          </div>
          <div v-else class="card-meta-item card-meta-online">
            <Video :size="14" />
            <span class="online-label">Online Class <span class="room-hint">({{ schedule.room }})</span></span>
          </div>
        </div>
      </div>
      <div class="card-units">
        <div class="card-units-value">{{ subject.units }}</div>
        <div class="card-units-label">Units</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { School, Globe, User, Clock, CalendarDays, MapPin, Video } from '@lucide/vue'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { useSubjectModes } from '../../composables/useSubjectModes.js'
import { toast } from 'vue-sonner'

const props = defineProps({
  subject: Object,
  schedule: Object
})

const { getMode, setMode } = useSubjectModes()
const mode = computed(() => getMode(props.subject.code))
const typeLabel = computed(() => props.subject.type ? ` · ${props.subject.type}` : '')

function handleSetMode(newMode) {
  if (mode.value === newMode) return
  setMode(props.subject.code, newMode)
  if (newMode === 'online') {
    toast(`Set to Online: ${props.subject.code}`, { description: 'Classes will be held virtually' })
  } else {
    toast(`Set to F2F: ${props.subject.code}`, { description: `Room ${props.schedule.room}` })
  }
}
</script>
