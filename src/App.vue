<template>
  <BackgroundEffects />

  <div class="container">
    <PwaBanner @toast="showToast" />
    <AppHeader @toast="showToast" />
    <CountdownBanner />
    <NavTabs v-model="activeView" />
    <StatsRow />

    <!-- Subjects View -->
    <div class="view-section" :class="{ active: activeView === 'cards' }">
      <TodaySection />
      <DayFilter v-model="dayFilter" />
      <ScheduleGrid :filter="dayFilter" />
    </div>

    <!-- Timetable View -->
    <div class="view-section" :class="{ active: activeView === 'timetable' }">
      <TimetableView @open-modal="openModal" />
    </div>

    <!-- Fees View -->
    <div class="view-section" :class="{ active: activeView === 'fees' }">
      <FeesView />
    </div>

    <AppFooter />
  </div>

  <SubjectModal
    :subject-code="modalCode"
    :day="modalDay"
    :is-open="modalOpen"
    @close="modalOpen = false"
    @jump-to-cards="jumpToCards"
  />

  <Toaster position="bottom-center" theme="dark" richColors />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { dayShort } from './data/schedule.js'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

import BackgroundEffects from './components/layout/BackgroundEffects.vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import CountdownBanner from './components/CountdownBanner.vue'
import NavTabs from './components/NavTabs.vue'
import StatsRow from './components/StatsRow.vue'
import TodaySection from './components/subjects/TodaySection.vue'
import DayFilter from './components/subjects/DayFilter.vue'
import ScheduleGrid from './components/subjects/ScheduleGrid.vue'
import TimetableView from './components/timetable/TimetableView.vue'
import SubjectModal from './components/timetable/SubjectModal.vue'
import FeesView from './components/fees/FeesView.vue'
import PwaBanner from './components/PwaBanner.vue'

// ─── View State ───
const savedTab = (() => { try { return localStorage.getItem('activeTab') } catch { return null } })()
const activeView = ref(savedTab && ['cards', 'timetable', 'fees'].includes(savedTab) ? savedTab : 'cards')

watch(activeView, (val) => {
  try { localStorage.setItem('activeTab', val) } catch (e) { /* noop */ }
})

// ─── Day Filter ───
const todayCode = dayShort[new Date().getDay()]
const dayFilter = ref(todayCode || 'all')

// ─── Modal ───
const modalOpen = ref(false)
const modalCode = ref('')
const modalDay = ref('')

function openModal(code, day) {
  modalCode.value = code
  modalDay.value = day
  modalOpen.value = true
}

function jumpToCards(code, day) {
  activeView.value = 'cards'
  dayFilter.value = day
}

function showToast(message) {
  toast(message)
}
</script>
