<template>
  <div class="countdown-banner" :class="state">
    <!-- Free day -->
    <template v-if="state === 'free'">
      <div class="countdown-left">
        <div class="countdown-status free"><Star :size="14" /> <span>Free Day</span></div>
        <div class="countdown-class-name">No classes scheduled today</div>
        <div class="countdown-class-detail">Enjoy your day off!</div>
      </div>
    </template>

    <!-- Ongoing -->
    <template v-else-if="state === 'ongoing' && currentClass">
      <div class="countdown-left">
        <div class="countdown-status ongoing"><Activity :size="14" /> <span>In Progress</span></div>
        <div class="countdown-class-name">{{ currentClass.name }}</div>
        <div class="countdown-class-detail" v-html="detail"></div>
      </div>
      <div class="countdown-timer">
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
    </template>

    <!-- Upcoming -->
    <template v-else-if="state === 'upcoming' && currentClass">
      <div class="countdown-left">
        <div class="countdown-status upcoming"><Hourglass :size="14" /> <span>Up Next</span></div>
        <div class="countdown-class-name">{{ currentClass.name }}</div>
        <div class="countdown-class-detail" v-html="detail"></div>
      </div>
      <div class="countdown-timer">
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
    </template>

    <!-- Done -->
    <template v-else-if="state === 'done'">
      <div class="countdown-left">
        <div class="countdown-status free"><CheckCircle :size="14" /> <span>Done for today</span></div>
        <div class="countdown-class-name">All classes completed!</div>
        <div class="countdown-class-detail">Great work today!</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Star, Activity, Hourglass, CheckCircle } from '@lucide/vue'
import { useCountdown } from '../composables/useCountdown.js'

const { state, currentClass, hours, minutes, seconds, detail } = useCountdown()

function pad(n) {
  return String(n).padStart(2, '0')
}
</script>
