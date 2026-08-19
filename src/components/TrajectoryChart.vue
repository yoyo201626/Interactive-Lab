<script setup>
import { computed } from 'vue'
import { scaleLinear } from 'd3-scale'
import { line as d3Line, curveLinear } from 'd3-shape'
import { bisector } from 'd3-array'

const props = defineProps({
  points: { type: Array, required: true },
  maxHeightPoint: { type: Object, required: true },
  impactPoint: { type: Object, required: true },
  currentTime: { type: Number, required: true },
  showComponents: { type: Boolean, default: true },
  launchAngle: { type: Number, required: true },
  playing: { type: Boolean, required: true },
})

defineEmits(['toggle-play'])

const width = 760
const height = 460
const margin = { top: 24, right: 28, bottom: 34, left: 44 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

// Fixed axis range, matching the reference mockup.
const xMax = 55
const yMax = 30

const xScale = scaleLinear().domain([0, xMax]).range([0, innerWidth])
const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0])

const xTicks = xScale.ticks(8)
const yTicks = yScale.ticks(6)

const sx = (x) => xScale(x)
const sy = (y) => yScale(y)

const lineGenerator = computed(() =>
  d3Line()
    .x((d) => sx(d.x))
    .y((d) => sy(d.y))
    .curve(curveLinear),
)

const pathD = computed(() => lineGenerator.value(props.points) ?? '')

const bisectT = bisector((d) => d.t).left

const currentPoint = computed(() => {
  const pts = props.points
  if (!pts.length) return { x: 0, y: 0, vx: 0, vy: 0 }
  const t = props.currentTime
  if (t <= pts[0].t) return pts[0]
  if (t >= pts[pts.length - 1].t) return pts[pts.length - 1]
  const i = bisectT(pts, t)
  const a = pts[i - 1]
  const b = pts[i]
  const span = b.t - a.t
  const frac = span > 0 ? (t - a.t) / span : 0
  return {
    t,
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
    vx: a.vx + (b.vx - a.vx) * frac,
    vy: a.vy + (b.vy - a.vy) * frac,
  }
})

const launchPoint = computed(() => props.points[0] ?? { x: 0, y: 0, vx: 0, vy: 0 })

const vxArrowLen = computed(() => {
  const p0 = launchPoint.value
  const speed = Math.hypot(p0.vx, p0.vy) || 1
  return 70 * (p0.vx / speed)
})
const vyArrowLen = computed(() => {
  const p0 = launchPoint.value
  const speed = Math.hypot(p0.vx, p0.vy) || 1
  return 70 * (p0.vy / speed)
})

// Decorative scenery, drawn in outer viewport coordinates so it spans the
// whole chart — the ground line is pinned to y=0 on the (fixed) axis scale.
const groundY = margin.top + sy(0)

function mountainPath(peaks) {
  const pts = [[0, groundY], ...peaks.map(([fx, dy]) => [fx * width, groundY - dy]), [width, groundY]]
  return `M${pts.map((p) => p.join(',')).join(' L')} Z`
}

const mountainsBack = mountainPath([
  [0.08, 70],
  [0.22, 30],
  [0.38, 95],
  [0.55, 40],
  [0.72, 100],
  [0.88, 45],
  [1, 75],
])
const mountainsFront = mountainPath([
  [0.15, 45],
  [0.32, 10],
  [0.5, 60],
  [0.68, 15],
  [0.85, 50],
  [1, 5],
])

// Trees and a house sitting on the ground line, purely as scale reference.
const treesAndHouse = [
  { type: 'tree', x: 0.58 * width, y: groundY, scale: 1 },
  { type: 'tree', x: 0.635 * width, y: groundY, scale: 0.8 },
  { type: 'house', x: 0.78 * width, y: groundY, scale: 1 },
  { type: 'tree', x: 0.94 * width, y: groundY, scale: 1.1 },
]

</script>

<template>
  <div class="chart-wrapper">
    <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg" role="img" aria-label="Projectile trajectory chart">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bfe3f8" />
          <stop offset="100%" stop-color="#eaf6ff" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bfe6a8" />
          <stop offset="100%" stop-color="#8fcf75" />
        </linearGradient>
      </defs>

      <rect :width="width" :height="height" fill="url(#sky)" />

      <!-- clouds -->
      <g class="cloud" transform="translate(90,54)">
        <ellipse cx="0" cy="0" rx="26" ry="14" />
        <ellipse cx="22" cy="-6" rx="20" ry="16" />
        <ellipse cx="-22" cy="4" rx="18" ry="11" />
      </g>
      <g class="cloud" transform="translate(430,36)">
        <ellipse cx="0" cy="0" rx="20" ry="11" />
        <ellipse cx="17" cy="-4" rx="15" ry="12" />
        <ellipse cx="-16" cy="3" rx="14" ry="9" />
      </g>
      <g class="cloud" transform="translate(650,70)">
        <ellipse cx="0" cy="0" rx="24" ry="13" />
        <ellipse cx="20" cy="-5" rx="17" ry="14" />
        <ellipse cx="-19" cy="4" rx="16" ry="10" />
      </g>

      <path :d="mountainsBack" class="mountain mountain-back" />
      <path :d="mountainsFront" class="mountain mountain-front" />
      <rect :x="0" :y="groundY" :width="width" :height="Math.max(height - groundY, 0)" fill="url(#grass)" />

      <template v-for="(item, i) in treesAndHouse" :key="'scenery' + i">
        <g v-if="item.type === 'tree'" :transform="`translate(${item.x},${item.y}) scale(${item.scale})`">
          <rect x="-3" y="-22" width="6" height="22" class="tree-trunk" />
          <circle cx="0" cy="-34" r="16" class="tree-foliage" />
          <circle cx="-11" cy="-24" r="12" class="tree-foliage" />
          <circle cx="11" cy="-24" r="12" class="tree-foliage" />
        </g>
        <g v-else :transform="`translate(${item.x},${item.y}) scale(${item.scale})`">
          <rect x="-22" y="-26" width="44" height="26" class="house-body" />
          <path d="M-26,-26 L0,-46 L26,-26 Z" class="house-roof" />
          <rect x="-7" y="-14" width="14" height="14" class="house-door" />
        </g>
      </template>

      <g :transform="`translate(${margin.left},${margin.top})`">
        <line
          v-for="tx in xTicks"
          :key="'gx' + tx"
          :x1="sx(tx)"
          :x2="sx(tx)"
          :y1="0"
          :y2="innerHeight"
          class="grid-line"
        />
        <line
          v-for="ty in yTicks"
          :key="'gy' + ty"
          :x1="0"
          :x2="innerWidth"
          :y1="sy(ty)"
          :y2="sy(ty)"
          class="grid-line"
        />

        <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight" class="axis-line" />
        <line :x1="0" :x2="0" :y1="0" :y2="innerHeight" class="axis-line" />

        <text
          v-for="tx in xTicks"
          :key="'xl' + tx"
          :x="sx(tx)"
          :y="innerHeight + 18"
          class="tick-label"
          text-anchor="middle"
        >
          {{ tx }}
        </text>
        <text
          v-for="ty in yTicks"
          :key="'yl' + ty"
          :x="-8"
          :y="sy(ty) + 4"
          class="tick-label"
          text-anchor="end"
        >
          {{ ty }}
        </text>
        <text :x="innerWidth" :y="innerHeight + 30" class="axis-title" text-anchor="end">x (m)</text>
        <text :x="4" :y="-10" class="axis-title">y (m)</text>

        <template v-if="showComponents">
          <line
            :x1="sx(maxHeightPoint.x)"
            :x2="sx(maxHeightPoint.x)"
            :y1="sy(maxHeightPoint.y)"
            :y2="innerHeight"
            class="guide-line"
          />
          <line
            :x1="0"
            :x2="sx(maxHeightPoint.x)"
            :y1="sy(maxHeightPoint.y)"
            :y2="sy(maxHeightPoint.y)"
            class="guide-line"
          />
        </template>

        <path :d="pathD" class="trajectory-path" />

        <g :transform="`translate(${sx(launchPoint.x)}, ${sy(launchPoint.y)})`">
          <g :transform="`rotate(${-launchAngle})`">
            <rect x="0" y="-4" width="30" height="8" rx="2" class="launcher-barrel" />
          </g>
          <circle r="9" class="launcher-base" />
        </g>

        <template v-if="showComponents">
          <line
            :x1="sx(launchPoint.x)"
            :y1="sy(launchPoint.y)"
            :x2="sx(launchPoint.x) + vxArrowLen"
            :y2="sy(launchPoint.y)"
            class="component-line vx-line"
          />
          <circle :cx="sx(launchPoint.x) + vxArrowLen" :cy="sy(launchPoint.y)" r="3" class="component-tip vx-line" />
          <line
            :x1="sx(launchPoint.x)"
            :y1="sy(launchPoint.y)"
            :x2="sx(launchPoint.x)"
            :y2="sy(launchPoint.y) - vyArrowLen"
            class="component-line vy-line"
          />
          <circle :cx="sx(launchPoint.x)" :cy="sy(launchPoint.y) - vyArrowLen" r="3" class="component-tip vy-line" />
        </template>

        <circle :cx="sx(maxHeightPoint.x)" :cy="sy(maxHeightPoint.y)" r="5" class="marker marker-apex" />
        <g
          v-if="showComponents"
          :transform="`translate(${sx(maxHeightPoint.x)}, ${sy(maxHeightPoint.y) - 16})`"
        >
          <rect x="-40" y="-16" width="80" height="20" rx="10" class="label-bg label-bg-apex" />
          <text text-anchor="middle" y="-2" class="label-text label-text-apex">Max Height</text>
        </g>

        <circle :cx="sx(impactPoint.x)" :cy="sy(impactPoint.y)" r="6" class="marker marker-impact" />
        <g :transform="`translate(${sx(impactPoint.x)}, ${sy(impactPoint.y) - 20})`">
          <rect x="-28" y="-16" width="56" height="20" rx="10" class="label-bg label-bg-impact" />
          <text text-anchor="middle" y="-2" class="label-text label-text-impact">Impact</text>
        </g>

        <circle :cx="sx(currentPoint.x)" :cy="sy(currentPoint.y)" r="7" class="marker marker-current" />
      </g>
    </svg>

    <button type="button" class="mobile-play-btn" @click="$emit('toggle-play')">
      {{ playing ? 'Pause' : 'Play' }}
    </button>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  padding: 20px 20px 0;
}

.mobile-play-btn {
  display: none;
}

@media (max-width: 860px) {
  .mobile-play-btn {
    display: block;
    position: absolute;
    top: 32px;
    left: 32px;
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
}

.chart-svg {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.tree-trunk {
  fill: #7c5330;
}

.tree-foliage {
  fill: #4c9a4c;
  stroke: #3d7f3d;
  stroke-width: 0.5;
}

.house-body {
  fill: #e6d2a8;
  stroke: #b8935a;
  stroke-width: 1;
}

.house-roof {
  fill: #b3462f;
}

.house-door {
  fill: #6b4423;
}

.cloud {
  fill: #ffffff;
  opacity: 0.85;
}

.mountain {
  stroke: none;
}

.mountain-back {
  fill: #a9c3d9;
  opacity: 0.6;
}

.mountain-front {
  fill: #8aa9c4;
  opacity: 0.75;
}

.grid-line {
  stroke: rgba(15, 23, 42, 0.08);
  stroke-width: 1;
}

.axis-line {
  stroke: rgba(15, 23, 42, 0.35);
  stroke-width: 1;
}

.tick-label {
  font-size: 11px;
  fill: rgba(15, 23, 42, 0.55);
}

.axis-title {
  font-size: 11px;
  fill: rgba(15, 23, 42, 0.55);
}

.trajectory-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.guide-line {
  stroke: rgba(15, 23, 42, 0.4);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.launcher-barrel {
  fill: #475569;
}

.launcher-base {
  fill: #334155;
}

.component-line {
  stroke-width: 2;
  stroke-dasharray: 3 3;
}

.vx-line {
  stroke: #0ea5e9;
}

.vy-line {
  stroke: #22c55e;
}

.component-tip.vx-line {
  fill: #0ea5e9;
}

.component-tip.vy-line {
  fill: #22c55e;
}

.marker {
  stroke: #fff;
  stroke-width: 1.5;
}

.marker-apex {
  fill: #a855f7;
}

.marker-impact {
  fill: #f97316;
}

.marker-current {
  fill: #2563eb;
}

.label-bg-apex {
  fill: #f3e8ff;
  stroke: #a855f7;
}

.label-bg-impact {
  fill: #ffedd5;
  stroke: #f97316;
}

.label-text {
  font-size: 11px;
  font-weight: 600;
}

.label-text-apex {
  fill: #7e22ce;
}

.label-text-impact {
  fill: #c2410c;
}
</style>
