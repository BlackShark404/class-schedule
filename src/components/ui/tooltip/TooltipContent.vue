<template>
  <TooltipPortal>
    <TooltipContent
      :side-offset="sideOffset"
      :class="cn('shadcn-tooltip-content', props.class)"
      v-bind="forwarded"
    >
      <slot />
      <TooltipArrow class="shadcn-tooltip-arrow" :width="8" :height="4" />
    </TooltipContent>
  </TooltipPortal>
</template>

<script setup>
import { TooltipContent, TooltipPortal, TooltipArrow, useForwardPropsEmits } from 'radix-vue'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  forceMount: { type: Boolean, default: undefined },
  side: { type: String, default: 'top' },
  sideOffset: { type: Number, default: 6 },
  align: { type: String, default: 'center' },
  alignOffset: { type: Number, default: 0 },
  avoidCollisions: { type: Boolean, default: true },
  collisionBoundary: { type: null, default: undefined },
  collisionPadding: { type: [Number, Object], default: 8 },
  arrowPadding: { type: Number, default: 0 },
  sticky: { type: String, default: 'partial' },
  hideWhenDetached: { type: Boolean, default: false },
  class: { type: String, default: '' },
  asChild: { type: Boolean, default: false },
  as: { type: null, default: undefined }
})

const emits = defineEmits(['escapeKeyDown', 'pointerDownOutside'])
const forwarded = useForwardPropsEmits(props, emits)
</script>
