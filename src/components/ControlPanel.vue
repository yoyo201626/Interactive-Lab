<script setup>
import { GRAVITY_PRESETS } from '../physics'

const props = defineProps({
  settings: { type: Object, required: true },
  playing: { type: Boolean, required: true },
})
const emit = defineEmits(['update:settings', 'toggle-play', 'reset'])

function update(key, value) {
  emit('update:settings', { ...props.settings, [key]: value })
}
</script>

<template>
  <div class="panel">
    <section class="panel-section">
      <h2>Launch Settings</h2>

      <div class="field">
        <div class="field-header">
          <label for="velocity">Initial Velocity</label>
          <div class="field-value">
            <input
              type="number"
              class="number-input"
              :value="settings.v0"
              min="5"
              max="50"
              step="0.1"
              @input="update('v0', Number($event.target.value))"
            />
            <span class="unit">m/s</span>
          </div>
        </div>
        <input
          id="velocity"
          type="range"
          min="5"
          max="50"
          step="0.1"
          :value="settings.v0"
          @input="update('v0', Number($event.target.value))"
        />
        <div class="range-labels"><span>5</span><span>50</span></div>
      </div>

      <div class="field">
        <div class="field-header">
          <label for="angle">Launch Angle</label>
          <div class="field-value">
            <input
              type="number"
              class="number-input"
              :value="settings.angle"
              min="10"
              max="80"
              step="1"
              @input="update('angle', Number($event.target.value))"
            />
            <span class="unit">°</span>
          </div>
        </div>
        <input
          id="angle"
          type="range"
          min="10"
          max="80"
          step="1"
          :value="settings.angle"
          @input="update('angle', Number($event.target.value))"
        />
        <div class="range-labels"><span>10°</span><span>80°</span></div>
      </div>

      <div class="field">
        <div class="field-header">
          <label for="height">Launch Height</label>
          <div class="field-value">
            <input
              type="number"
              class="number-input"
              :value="settings.height"
              min="0"
              max="10"
              step="0.1"
              @input="update('height', Number($event.target.value))"
            />
            <span class="unit">m</span>
          </div>
        </div>
        <input
          id="height"
          type="range"
          min="0"
          max="10"
          step="0.1"
          :value="settings.height"
          @input="update('height', Number($event.target.value))"
        />
        <div class="range-labels"><span>0</span><span>10</span></div>
      </div>
    </section>

    <section class="panel-section">
      <h2>Environment</h2>

      <div class="field row">
        <label for="gravity">Gravity</label>
        <select
          id="gravity"
          class="select-input"
          :value="settings.gravity"
          @change="update('gravity', Number($event.target.value))"
        >
          <option v-for="preset in GRAVITY_PRESETS" :key="preset.label" :value="preset.value">
            {{ preset.label }} ({{ preset.value }} m/s²)
          </option>
        </select>
      </div>

      <div class="field row">
        <label for="air-resistance">Air Resistance</label>
        <button
          id="air-resistance"
          type="button"
          class="toggle"
          :class="{ active: settings.airResistance }"
          role="switch"
          :aria-checked="settings.airResistance"
          @click="update('airResistance', !settings.airResistance)"
        >
          <span class="toggle-knob" />
        </button>
      </div>

      <div class="field row">
        <label for="show-components">Show Components</label>
        <button
          id="show-components"
          type="button"
          class="toggle"
          :class="{ active: settings.showComponents }"
          role="switch"
          :aria-checked="settings.showComponents"
          @click="update('showComponents', !settings.showComponents)"
        >
          <span class="toggle-knob" />
        </button>
      </div>
    </section>

    <div class="panel-actions">
      <button class="btn btn-secondary" type="button" @click="emit('reset')">
        Reset Simulation
      </button>
      <button class="btn btn-primary" type="button" @click="emit('toggle-play')">
        {{ playing ? 'Pause' : 'Play' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

h2 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
}

.field-value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.number-input {
  width: 56px;
  padding: 4px 6px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  text-align: right;
  background: var(--bg);
  color: var(--text-h);
}

.unit {
  font-size: 12px;
  color: var(--text-muted);
}

input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.select-input {
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg);
  color: var(--text-h);
}

.toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.toggle.active {
  background: var(--accent);
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.toggle.active .toggle-knob {
  transform: translateX(18px);
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-secondary {
  background: var(--bg);
  border-color: var(--border);
  color: var(--text-h);
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}
</style>
