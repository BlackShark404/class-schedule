<template>
  <div>
    <div class="timetable-header-row">
      <h2 class="section-title" style="margin-bottom: 0;">Weekly Timetable</h2>
      <div class="timetable-mode-switch">
        <button type="button" class="mode-switch-btn" :class="{ active: mode === 'timeline' }" @click="mode = 'timeline'">
          <List :size="14" /><span>Day Timeline</span>
        </button>
        <button type="button" class="mode-switch-btn" :class="{ active: mode === 'grid' }" @click="mode = 'grid'">
          <LayoutGrid :size="14" /><span>Full Grid</span>
        </button>
      </div>
    </div>

    <TimelineView v-if="mode === 'timeline'" @open-modal="(code, day) => $emit('openModal', code, day)" />
    <TimetableGrid v-else @open-modal="(code, day) => $emit('openModal', code, day)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { List, LayoutGrid } from '@lucide/vue'
import TimelineView from './TimelineView.vue'
import TimetableGrid from './TimetableGrid.vue'

defineEmits(['openModal'])

const saved = (() => { try { return localStorage.getItem('timetableMode') } catch { return null } })()
const mode = ref(saved || (window.innerWidth < 768 ? 'timeline' : 'grid'))
</script>
