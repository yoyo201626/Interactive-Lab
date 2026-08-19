// Quadratic drag coefficient (per unit mass), applied only when air resistance is enabled.
// Illustrative fixed value, not exposed as a control.
const DRAG_COEFFICIENT = 0.02

export const GRAVITY_PRESETS = [
  { label: 'Earth', value: 9.81 },
  { label: 'Moon', value: 1.62 },
  { label: 'Mars', value: 3.71 },
  { label: 'Jupiter', value: 24.79 },
]

/**
 * Numerically integrates projectile motion (semi-implicit Euler) from launch
 * until it crosses y = 0, optionally under quadratic air resistance.
 */
export function simulateProjectile({ v0, angleDeg, height, gravity, airResistance, dt = 0.01 }) {
  const angle = (angleDeg * Math.PI) / 180
  let x = 0
  let y = height
  let vx = v0 * Math.cos(angle)
  let vy = v0 * Math.sin(angle)
  let t = 0

  const points = [{ t, x, y, vx, vy }]
  let maxHeightPoint = points[0]

  const maxSteps = 20000
  for (let i = 0; i < maxSteps; i++) {
    const speed = Math.hypot(vx, vy)
    const drag = airResistance ? DRAG_COEFFICIENT * speed : 0
    const ax = -drag * vx
    const ay = -gravity - drag * vy

    const prevX = x
    const prevY = y
    const prevVx = vx
    const prevVy = vy

    vx += ax * dt
    vy += ay * dt
    x += vx * dt
    y += vy * dt
    t += dt

    if (y > maxHeightPoint.y) {
      maxHeightPoint = { t, x, y, vx, vy }
    }

    if (y <= 0) {
      const frac = prevY / (prevY - y)
      const landingPoint = {
        t: t - dt + frac * dt,
        x: prevX + (x - prevX) * frac,
        y: 0,
        vx: prevVx + (vx - prevVx) * frac,
        vy: prevVy + (vy - prevVy) * frac,
      }
      points.push(landingPoint)
      return {
        points,
        maxHeightPoint,
        flightTime: landingPoint.t,
        range: landingPoint.x,
        impactSpeed: Math.hypot(landingPoint.vx, landingPoint.vy),
        impactPoint: landingPoint,
      }
    }

    points.push({ t, x, y, vx, vy })
  }

  const last = points[points.length - 1]
  return {
    points,
    maxHeightPoint,
    flightTime: last.t,
    range: last.x,
    impactSpeed: Math.hypot(last.vx, last.vy),
    impactPoint: last,
  }
}
