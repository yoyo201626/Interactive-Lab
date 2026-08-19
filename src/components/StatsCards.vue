<script setup>
defineProps({
  maxHeight: { type: Number, required: true },
  flightTime: { type: Number, required: true },
  range: { type: Number, required: true },
  impactSpeed: { type: Number, required: true },
})

function fmt(value, decimals = 1) {
  return Number.isFinite(value) ? value.toFixed(decimals) : '—'
}
</script>

<template>
  <div class="stats">
    <div class="stat-card stat-max-height">
      <div class="stat-icon">↑</div>
      <div class="stat-body">
        <div class="stat-label">Max Height</div>
        <div class="stat-value">{{ fmt(maxHeight) }}<span class="stat-unit">m</span></div>
        <div class="stat-sub">Above ground</div>
      </div>
    </div>
    <div class="stat-card stat-flight-time">
      <div class="stat-icon">⏱</div>
      <div class="stat-body">
        <div class="stat-label">Flight Time</div>
        <div class="stat-value">{{ fmt(flightTime, 2) }}<span class="stat-unit">s</span></div>
        <div class="stat-sub">Total time in air</div>
      </div>
    </div>
    <div class="stat-card stat-range">
      <div class="stat-icon">→</div>
      <div class="stat-body">
        <div class="stat-label">Horizontal Range</div>
        <div class="stat-value">{{ fmt(range) }}<span class="stat-unit">m</span></div>
        <div class="stat-sub">From launch point</div>
      </div>
    </div>
    <div class="stat-card stat-impact-speed">
      <div class="stat-icon">⚡</div>
      <div class="stat-body">
        <div class="stat-label">Impact Speed</div>
        <div class="stat-value">{{ fmt(impactSpeed) }}<span class="stat-unit">m/s</span></div>
        <div class="stat-sub">At landing</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
}

.stat-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stat-max-height .stat-icon {
  background: #f3e8ff;
  color: #7e22ce;
}

.stat-flight-time .stat-icon {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-range .stat-icon {
  background: #dcfce7;
  color: #15803d;
}

.stat-impact-speed .stat-icon {
  background: #ffedd5;
  color: #c2410c;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-muted);
}

.stat-max-height .stat-label {
  color: #7e22ce;
}
.stat-flight-time .stat-label {
  color: #1d4ed8;
}
.stat-range .stat-label {
  color: #15803d;
}
.stat-impact-speed .stat-label {
  color: #c2410c;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-h);
}

.stat-unit {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  margin-left: 4px;
}

.stat-sub {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
