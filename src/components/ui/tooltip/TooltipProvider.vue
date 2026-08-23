<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>

<script setup>
import { TooltipProvider } from 'radix-vue'

const props = defineProps({
  delayDuration: { type: Number, default: 150 },
  skipDelayDuration: { type: Number, default: 300 },
  disableHoverableContent: { type: Boolean, default: false },
  disableClosingTrigger: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>
