<template>
  <TooltipRoot v-bind="forwarded">
    <slot />
  </TooltipRoot>
</template>

<script setup>
import { TooltipRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps({
  defaultOpen: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
  delayDuration: { type: Number, default: undefined },
  disableHoverableContent: { type: Boolean, default: undefined },
  disableClosingTrigger: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  ignoreNonKeyboardFocus: { type: Boolean, default: undefined }
})

const emits = defineEmits(['update:open'])
const forwarded = useForwardPropsEmits(props, emits)
</script>
