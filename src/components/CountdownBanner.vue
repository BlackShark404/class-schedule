<template>
  <div v-if="currentClass" class="countdown-banner" :class="state">
    <div class="countdown-left">
      <div class="countdown-status" :class="state">
        <Activity v-if="state === 'ongoing'" :size="14" />
        <Hourglass v-else :size="14" />
        <span>{{ statusLabel }}</span>
      </div>
      <div class="countdown-class-name">{{ currentClass.name }}</div>
      <div class="countdown-class-detail" v-html="detail"></div>
    </div>

    <!-- Real-time Live Timer -->
    <div class="countdown-timer">
      <template v-if="days > 0">
        <div class="countdown-unit">
          <div class="countdown-unit-value">{{ pad(days) }}</div>
          <div class="countdown-unit-label">days</div>
        </div>
        <div class="countdown-separator">:</div>
      </template>

      <div class="countdown-unit">
        <div class="countdown-unit-value">{{ pad(hours) }}</div>
        <div class="countdown-unit-label">hrs</div>
      </div>
      <div class="countdown-separator">:</div>

      <div class="countdown-unit">
        <div class="countdown-unit-value">{{ pad(minutes) }}</div>
        <div class="countdown-unit-label">min</div>
      </div>
      <div class="countdown-separator">:</div>

      <div class="countdown-unit">
        <div class="countdown-unit-value">{{ pad(seconds) }}</div>
        <div class="countdown-unit-label">sec</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, Hourglass } from '@lucide/vue'
import { useCountdown } from '../composables/useCountdown.js'

const { state, statusLabel, currentClass, days, hours, minutes, seconds, detail } = useCountdown()

function pad(n) {
  return String(n).padStart(2, '0')
}
</script>
