<template>
  <div class="filter-bar">
    <div class="day-filter">
      <button class="day-pill" :class="{ active: modelValue === 'all' }" @click="$emit('update:modelValue', 'all')">All</button>
      <button
        v-for="d in dayList" :key="d"
        class="day-pill"
        :class="{ active: modelValue === d, 'today-pill': d === todayCode }"
        :data-day="d"
        @click="$emit('update:modelValue', d)"
      >{{ dayLabels[d] }}</button>
    </div>

    <div class="filter-actions-group">
      <div class="batch-mode-toggle">
        <Tooltip>
          <TooltipTrigger as-child>
            <button type="button" class="batch-btn f2f" @click="handleSetAll('f2f')" aria-label="Set all subjects to Face-to-Face">
              <School :size="13" />
              <span>All F2F</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="6">
            <span>Switch entire schedule to Face-to-Face</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <button type="button" class="batch-btn online" @click="handleSetAll('online')" aria-label="Set all subjects to Online">
              <Globe :size="13" />
              <span>All Online</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="6">
            <span>Switch entire schedule to Online</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <div class="hybrid-summary-badge">
        <template v-if="summary.onlineCount > 0 && summary.f2fCount > 0">
          <span class="badge-dot hybrid"></span>{{ summary.f2fCount }} F2F · {{ summary.onlineCount }} Online
        </template>
        <template v-else-if="summary.onlineCount > 0">
          <span class="badge-dot online"></span>All Online ({{ summary.onlineCount }})
        </template>
        <template v-else>
          <span class="badge-dot f2f"></span>All F2F ({{ summary.f2fCount }})
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { School, Globe } from '@lucide/vue'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { dayList, dayLabels, dayShort } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'
import { toast } from 'vue-sonner'

defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

const { setAllModes, summary } = useSubjectModes()
const todayCode = dayShort[new Date().getDay()]

function handleSetAll(mode) {
  setAllModes(mode)
  if (mode === 'online') {
    toast.success('All set to Online', { description: 'Your schedule has been updated to fully virtual.' })
  } else {
    toast.success('All set to F2F', { description: 'Your schedule has been updated to face-to-face.' })
  }
}
</script>
