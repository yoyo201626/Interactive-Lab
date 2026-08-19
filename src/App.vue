<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import TrajectoryChart from './components/TrajectoryChart.vue'
import StatsCards from './components/StatsCards.vue'
import { simulateProjectile } from './physics'

const settings = reactive({
  v0: 22,
  angle: 45,
  height: 1.5,
  gravity: 9.81,
  airResistance: false,
  showComponents: true,
})

const playing = ref(true)
const currentTime = ref(0)

const simulation = computed(() =>
  simulateProjectile({
    v0: settings.v0,
    angleDeg: settings.angle,
    height: settings.height,
    gravity: settings.gravity,
    airResistance: settings.airResistance,
  }),
)

watch(simulation, () => {
  currentTime.value = 0
})

let rafId = null
let lastTimestamp = null

function tick(timestamp) {
  if (lastTimestamp === null) lastTimestamp = timestamp
  const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05)
  lastTimestamp = timestamp

  if (playing.value) {
    const next = currentTime.value + delta
    if (next >= simulation.value.flightTime) {
      currentTime.value = simulation.value.flightTime
      playing.value = false
    } else {
      currentTime.value = next
    }
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

function handleUpdateSettings(next) {
  Object.assign(settings, next)
}

function handleTogglePlay() {
  if (!playing.value && currentTime.value >= simulation.value.flightTime) {
    currentTime.value = 0
  }
  playing.value = !playing.value
}

function handleReset() {
  currentTime.value = 0
  playing.value = true
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <ControlPanel
        :settings="settings"
        :playing="playing"
        @update:settings="handleUpdateSettings"
        @toggle-play="handleTogglePlay"
        @reset="handleReset"
      />
    </aside>
    <main class="main-area">
      <TrajectoryChart
        :points="simulation.points"
        :max-height-point="simulation.maxHeightPoint"
        :impact-point="simulation.impactPoint"
        :current-time="currentTime"
        :show-components="settings.showComponents"
        :launch-angle="settings.angle"
      />
      <StatsCards
        :max-height="simulation.maxHeightPoint.y"
        :flight-time="simulation.flightTime"
        :range="simulation.range"
        :impact-speed="simulation.impactSpeed"
      />
    </main>
  </div>
</template>
