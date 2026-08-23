<template>
  <header class="header">
    <div class="header-top">
      <div class="header-top-left">
        <div class="uni-badge">
          <div class="uni-icon">
            <img src="/ctu-logo.png" alt="CTU Logo" class="uni-logo-img"
              @error="e => { e.target.style.display='none'; e.target.parentElement.classList.add('fallback'); e.target.parentElement.innerText='CTU' }">
          </div>
          <span class="uni-name">
            <span class="uni-name-full">Cebu Technological University — Main Campus</span>
            <span class="uni-name-short">CTU Main Campus</span>
          </span>
        </div>
        <div class="semester-badge">1st Semester · SY 2026–2027</div>
      </div>
      <div class="header-controls">
        <button class="notif-toggle" :class="{ active: notifEnabled }" @click="handleNotifToggle" title="Class Reminders">
          <Bell v-if="notifEnabled" :size="18" />
          <BellOff v-else :size="18" />
        </button>
        <button class="theme-toggle" @click="handleThemeToggle" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <Sun v-if="!isDark" :size="18" />
          <Moon v-else :size="18" />
        </button>
      </div>
    </div>
    <div class="hero">
      <h1><span class="gradient-text">Class Schedule</span></h1>
      <div class="hero-sub">
        <div class="hero-sub-item">
          <div class="dot"></div>
          <span>Bachelor of Science in Information Technology</span>
        </div>
        <div class="hero-sub-item">
          <GraduationCap :size="16" />
          <span>4th Year · Section BSIT_DAY_IV-A</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Moon, Sun, Bell, BellOff, GraduationCap } from '@lucide/vue'
import { useTheme } from '../../composables/useTheme.js'
import { useNotifications } from '../../composables/useNotifications.js'
import { toast } from 'vue-sonner'

const { isDark, toggleTheme } = useTheme()
const { enabled: notifEnabled, toggle: toggleNotif } = useNotifications()

function handleThemeToggle() {
  const mode = toggleTheme()
  toast(mode === 'light' ? '☀️ Light mode' : '🌙 Dark mode')
}

async function handleNotifToggle() {
  const result = await toggleNotif()
  if (result === 'enabled') toast.success('🔔 Reminders ON — 15 min before each class')
  else if (result === 'disabled') toast('🔕 Reminders turned off')
  else if (result === 'unsupported') toast.error('⚠️ Notifications not supported in this browser')
  else if (result === 'denied') toast.error('⚠️ Please allow notifications in browser settings')
}
</script>
