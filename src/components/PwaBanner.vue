<template>
  <div class="pwa-banner" :class="{ show: visible }">
    <div class="pwa-banner-text">
      <span><Smartphone :size="20" /></span>
      <span>Install this schedule on your home screen for quick access!</span>
    </div>
    <div class="pwa-banner-actions">
      <button class="pwa-install-btn" @click="install">Install App</button>
      <button class="pwa-dismiss-btn" @click="dismiss">Later</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Smartphone } from '@lucide/vue'
import { toast } from 'vue-sonner'

const visible = ref(false)
let deferredPrompt = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    const dismissed = localStorage.getItem('pwaDismissed')
    if (!dismissed) visible.value = true
  })

  window.addEventListener('appinstalled', () => {
    visible.value = false
    deferredPrompt = null
    toast.success('✅ App installed! Find it on your home screen')
  })
})

function install() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(result => {
      if (result.outcome === 'accepted') toast('⬇️ Installing...')
      deferredPrompt = null
      visible.value = false
    })
  } else {
    toast('Tip: Tap your browser menu (⋮ or Share) → "Add to Home screen" / "Install"')
  }
}

function dismiss() {
  visible.value = false
  try { localStorage.setItem('pwaDismissed', 'true') } catch (e) { /* noop */ }
}
</script>
