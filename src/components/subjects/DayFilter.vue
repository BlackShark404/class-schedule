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
        <button type="button" class="batch-btn f2f" @click="setAllModes('f2f')" title="Set all subjects to Face-to-Face">
          <School :size="13" />
          <span>All F2F</span>
        </button>
        <button type="button" class="batch-btn online" @click="setAllModes('online')" title="Set all subjects to Online">
          <Globe :size="13" />
          <span>All Online</span>
        </button>
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
import { dayList, dayLabels, dayShort } from '../../data/schedule.js'
import { useSubjectModes } from '../../composables/useSubjectModes.js'

defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

const { setAllModes, summary } = useSubjectModes()
const todayCode = dayShort[new Date().getDay()]
</script>
