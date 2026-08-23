<template>
  <div class="nav-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-tab"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      <component :is="tab.icon" :size="15" />
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { FileText, Calendar, DollarSign } from '@lucide/vue'

defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

const tabs = [
  { id: 'cards', label: 'Subjects', icon: FileText },
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'fees', label: 'Fees', icon: DollarSign }
]
</script>
