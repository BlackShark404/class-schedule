<template>
  <div class="stats-row">
    <div class="stat-card stat-purple">
      <div class="stat-header">
        <span class="stat-label">Subjects</span>
        <div class="stat-icon"><BookOpen :size="15" /></div>
      </div>
      <div class="stat-value accent-1">{{ subjects.length }}</div>
      <div class="stat-subtitle">{{ lectureCount }} Lecture · {{ labCount }} Lab</div>
    </div>

    <div class="stat-card stat-teal">
      <div class="stat-header">
        <span class="stat-label">Total Units</span>
        <div class="stat-icon"><Zap :size="15" /></div>
      </div>
      <div class="stat-value accent-2">{{ totalUnits }}</div>
      <div class="stat-subtitle">{{ totalUnits }}.0 Credit Load</div>
    </div>

    <div class="stat-card stat-pink">
      <div class="stat-header">
        <span class="stat-label">Schedule</span>
        <div class="stat-icon"><Calendar :size="15" /></div>
      </div>
      <div class="stat-value accent-3">M–F</div>
      <div class="stat-subtitle">Mon to Fri (5 Days)</div>
    </div>

    <div class="stat-card stat-green">
      <div class="stat-header">
        <span class="stat-label">Total Fees</span>
        <div class="stat-icon"><DollarSign :size="15" /></div>
      </div>
      <div class="stat-value accent-4">₱{{ totalFees.toLocaleString() }}</div>
      <div class="stat-subtitle">₱{{ costPerUnit.toFixed(2) }} / unit</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BookOpen, Zap, Calendar, DollarSign } from '@lucide/vue'
import { subjects, totalUnits, totalFees, costPerUnit } from '../data/schedule.js'

const lectureCount = computed(() => subjects.filter(s => s.type !== 'Laboratory').length)
const labCount = computed(() => subjects.filter(s => s.type === 'Laboratory').length)
</script>
