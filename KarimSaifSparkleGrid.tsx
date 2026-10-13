/**
 * Made with 💛 by Karim Saif
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

"use client"

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer, useReducedMotion } from "framer"

type Preset = "original" | "midnight" | "aurora" | "rose" | "gold"
type Props = {
    preset: Preset
    customColors: boolean
    color: string
    backgroundColor: string
    size: number
    speed: number
    density: number
    sparkleThreshold: number
    gridOpacity: number
    pointerStrength: number
    paused: boolean
    style?: React.CSSProperties
}
type Config = { color: string; cell: number; speed: number; density: number; threshold: number; gridOpacity: number; pointerStrength: number; paused: boolean }
const PRESETS: Record<Preset, { color: string; background: string }> = {
    original: { color: "#F4F4F5", background: "#0E0F11" },
    midnight: { color: "#8AB4FF", background: "#080D1B" },
    aurora: { color: "#82FFD7", background: "#061713" },
    rose: { color: "#FF91C8", background: "#190B17" },
    gold: { color: "#FFD78A", background: "#171108" },
}
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))
const safe = (n: number, fallback: number, min: number, max: number) => clamp(Number.isFinite(n) ? n : fallback, min, max)
function hash(x: number, y: number) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return h - Math.floor(h)
}
function noise(x: number, y: number) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
function intensity(i: number, j: number, t: number, density: number) {
    const n = noise(i * .24 + t * .12, j * .24 - t * .08) * .7 + noise(i * .55 - t * .14, j * .55 + 9) * .3
    return clamp((n - density) / .21, 0, 1)
}
function StaticPreview({ config }: { config: Config }) {
    const w = 1200, h = 800, cell = config.cell
    const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1
    const ox = (w - cols * cell) / 2, oy = (h - rows * cell) / 2
    const dots: string[] = [], stars: string[] = [], lines: string[] = []
    for (let i = 0; i <= cols; i++) lines.push(`M${ox + i * cell} 0V${h}`)
    for (let j = 0; j <= rows; j++) lines.push(`M0 ${oy + j * cell}H${w}`)
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const s = intensity(i, j, 0, config.density)
        if (s < .08) continue
        const x = ox + (i + .5) * cell, y = oy + (j + .5) * cell
        if (s < config.threshold) {
            const r = cell * (.04 + .2 * s / config.threshold)
            dots.push(`M${x + r} ${y}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0`)
        } else {
            const r = cell * (.3 + .12 * (s - config.threshold) / (1 - config.threshold))
            stars.push(`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`)
        }
    }
    return <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <path d={lines.join(" ")} fill="none" stroke={config.color} strokeWidth={1} opacity={config.gridOpacity} />
        <path d={dots.join(" ")} fill={config.color} fillRule="nonzero" />
        <path d={stars.join(" ")} fill={config.color} />
    </svg>
}
export default function KarimSaifSparkleGrid(props: Props) {
    const { preset = "original", customColors = false, color = "#F4F4F5", backgroundColor = "#0E0F11", size = 30, speed = 1, density = .6, sparkleThreshold = .72, gridOpacity = .07, pointerStrength = 1.1, paused = false, style } = props
    const isStatic = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()
    const staticMode = isStatic || !!reducedMotion
    const palette = PRESETS[preset] || PRESETS.original
    const bg = customColors ? backgroundColor : palette.background
    const cfg: Config = {
        color: customColors ? color : palette.color,
        cell: safe(size, 30, 12, 100),
        speed: safe(speed, 1, 0, 5),
        density: safe(density, .6, .3, .85),
        threshold: safe(sparkleThreshold, .72, .5, .95),
        gridOpacity: safe(gridOpacity, .07, 0, .4),
        pointerStrength: safe(pointerStrength, 1.1, 0, 3),
        paused,
    }
    const hostRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const cfgRef = React.useRef(cfg)
    cfgRef.current = cfg
    const controlRef = React.useRef<null | ((geometry: boolean) => void)>(null)
    React.useEffect(() => {
        if (staticMode) return
        const host = hostRef.current, canvas = canvasRef.current
        if (!host || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        let w = 0, h = 0, cols = 0, rows = 0, cell = cfgRef.current.cell
        let shown = new Float32Array(0), raf = 0, last = 0, elapsed = 0
        let inView = typeof IntersectionObserver === "undefined", pageVisible = !document.hidden, destroyed = false
        const pointer = { x: 0, y: 0, strength: 0, target: 0 }
        const active = () => !destroyed && inView && pageVisible && !cfgRef.current.paused && cfgRef.current.speed > 0 && w > 0 && h > 0
        function draw(instant = false) {
            if (!ctx || !w || !h) return
            const s = cfgRef.current, ease = instant ? 1 : .18
            ctx.clearRect(0, 0, w, h)
            pointer.strength += (pointer.target - pointer.strength) * ease
            const ox = (w - cols * cell) / 2, oy = (h - rows * cell) / 2
            if (s.gridOpacity) {
                ctx.beginPath()
                for (let i = 0; i <= cols; i++) { const x = ox + i * cell; ctx.moveTo(x, 0); ctx.lineTo(x, h) }
                for (let j = 0; j <= rows; j++) { const y = oy + j * cell; ctx.moveTo(0, y); ctx.lineTo(w, y) }
                ctx.strokeStyle = s.color
                ctx.globalAlpha = s.gridOpacity
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.globalAlpha = 1
            }
            const dots = new Path2D(), stars = new Path2D(), lens2 = (cell * 1.9) ** 2
            for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
                const k = j * cols + i, x = ox + (i + .5) * cell, y = oy + (j + .5) * cell
                let goal = intensity(i, j, elapsed, s.density)
                if (pointer.strength > .001 && s.pointerStrength) {
                    const dx = x - pointer.x, dy = y - pointer.y
                    goal += s.pointerStrength * pointer.strength * Math.exp(-(dx * dx + dy * dy) / lens2)
                }
                goal = clamp(goal, 0, 1)
                shown[k] = instant ? goal : shown[k] + (goal - shown[k]) * ease
                const v = shown[k]
                if (v < .08) continue
                if (v < s.threshold) {
                    const r = cell * (.04 + .2 * v / s.threshold)
                    dots.moveTo(x + r, y)
                    dots.arc(x, y, r, 0, Math.PI * 2)
                } else {
                    const r = cell * (.3 + .12 * (v - s.threshold) / (1 - s.threshold))
                    stars.moveTo(x, y - r)
                    stars.quadraticCurveTo(x, y, x + r, y)
                    stars.quadraticCurveTo(x, y, x, y + r)
                    stars.quadraticCurveTo(x, y, x - r, y)
                    stars.quadraticCurveTo(x, y, x, y - r)
                    stars.closePath()
                }
            }
            ctx.fillStyle = s.color
            ctx.fill(dots)
            ctx.fill(stars)
        }
        function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0 }
        function tick(now: number) {
            raf = 0
            if (!active()) return
            if (!last) last = now - 1000 / 30
            const delta = now - last
            if (delta >= 1000 / 30 - 1) {
                elapsed += Math.min(delta / 1000, .1) * cfgRef.current.speed
                last = now
                draw()
            }
            if (active()) raf = requestAnimationFrame(tick)
        }
        function update() {
            if (!active()) { stop(); return }
            if (!raf) { last = 0; raf = requestAnimationFrame(tick) }
        }
        function resize(force = false) {
            if (!host || !canvas || !ctx || destroyed) return
            const rect = host.getBoundingClientRect(), nw = Math.max(0, rect.width), nh = Math.max(0, rect.height)
            if (!nw || !nh) { w = 0; h = 0; stop(); return }
            const rawDpr = clamp(window.devicePixelRatio || 1, 1, 2)
            const dpr = rawDpr * Math.min(1, Math.sqrt(4000000 / (nw * nh * rawDpr * rawDpr)))
            const pw = Math.max(1, Math.round(nw * dpr)), ph = Math.max(1, Math.round(nh * dpr))
            const newCell = cfgRef.current.cell
            if (!force && w === nw && h === nh && cell === newCell && canvas.width === pw && canvas.height === ph) return
            const resolutionChanged = canvas.width !== pw || canvas.height !== ph
            w = nw; h = nh; cell = newCell
            if (resolutionChanged) { canvas.width = pw; canvas.height = ph }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const nc = Math.ceil(w / cell) + 1, nr = Math.ceil(h / cell) + 1
            if (nc !== cols || nr !== rows) { cols = nc; rows = nr; shown = new Float32Array(cols * rows) }
            draw(true)
            update()
        }
        function move(e: PointerEvent) {
            if (cfgRef.current.paused || !inView || !pageVisible || !cfgRef.current.pointerStrength) return
            const r = host!.getBoundingClientRect()
            pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.target = 1
            if (cfgRef.current.speed === 0) { pointer.strength = 1; draw(true) }
        }
        function leave() {
            if (cfgRef.current.paused) return
            pointer.target = 0
            if (cfgRef.current.speed === 0) { pointer.strength = 0; draw(true) }
        }
        function visibility() { pageVisible = !document.hidden; update() }
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null
        const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => { inView = !!entries[0]?.isIntersecting; update() }) : null
        ro?.observe(host)
        io?.observe(host)
        host.addEventListener("pointermove", move, { passive: true })
        host.addEventListener("pointerleave", leave)
        document.addEventListener("visibilitychange", visibility)
        if (!ro) window.addEventListener("resize", onResize)
        function onResize() { resize() }
        controlRef.current = (geometry: boolean) => {
            if (destroyed) return
            if (geometry) resize(true)
            else { draw(true); update() }
        }
        resize(true)
        update()
        return () => {
            destroyed = true
            stop()
            controlRef.current = null
            ro?.disconnect()
            io?.disconnect()
            host.removeEventListener("pointermove", move)
            host.removeEventListener("pointerleave", leave)
            document.removeEventListener("visibilitychange", visibility)
            if (!ro) window.removeEventListener("resize", onResize)
        }
    }, [staticMode])
    React.useEffect(() => { controlRef.current?.(false) }, [cfg.color, cfg.density, cfg.threshold, cfg.gridOpacity, cfg.pointerStrength, cfg.speed, cfg.paused])
    React.useEffect(() => { controlRef.current?.(true) }, [cfg.cell])
    return <div ref={hostRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", isolation: "isolate", ...style, backgroundColor: bg }}>
        {staticMode
            ? <StaticPreview config={cfg} />
            : <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />}
    </div>
}
KarimSaifSparkleGrid.defaultProps = {
    preset: "original", customColors: false, color: "#F4F4F5", backgroundColor: "#0E0F11",
    size: 30, speed: 1, density: .6, sparkleThreshold: .72, gridOpacity: .07, pointerStrength: 1.1, paused: false,
}
addPropertyControls(KarimSaifSparkleGrid, {
    preset: { type: ControlType.Enum, title: "Preset", options: ["original", "midnight", "aurora", "rose", "gold"], optionTitles: ["Original", "Midnight", "Aurora", "Rose", "Gold"], defaultValue: "original", description: "Choose a curated color theme for the sparkle grid." },
    customColors: { type: ControlType.Boolean, title: "Custom Colors", defaultValue: false, enabledTitle: "On", disabledTitle: "Off", description: "Override the preset with your own sparkle and background colors." },
    color: { type: ControlType.Color, title: "Sparkle Color", defaultValue: "#F4F4F5", hidden: p => !p.customColors, description: "Color of the grid lines, dots, circles, and sparkles." },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#0E0F11", hidden: p => !p.customColors, description: "Color behind the animated grid." },
    size: { type: ControlType.Number, title: "Cell Size", min: 12, max: 100, step: 1, defaultValue: 30, unit: "px", displayStepper: true, description: "Set spacing and scale of the grid and sparkle glyphs." },
    speed: { type: ControlType.Number, title: "Speed", min: 0, max: 5, step: .1, defaultValue: 1, displayStepper: true, description: "Change drift speed; zero stops automatic movement." },
    density: { type: ControlType.Number, title: "Density", min: .3, max: .85, step: .01, defaultValue: .6, displayStepper: true, description: "Lower values produce more active sparkle clusters." },
    sparkleThreshold: { type: ControlType.Number, title: "Sparkle Point", min: .5, max: .95, step: .01, defaultValue: .72, displayStepper: true, description: "Choose when circles turn into four-point sparkles." },
    gridOpacity: { type: ControlType.Number, title: "Grid Opacity", min: 0, max: .4, step: .01, defaultValue: .07, displayStepper: true, description: "Control visibility of hairline grid lines; zero hides them." },
    pointerStrength: { type: ControlType.Number, title: "Pointer Glow", min: 0, max: 3, step: .1, defaultValue: 1.1, displayStepper: true, description: "Control how strongly nearby cells bloom around the cursor." },
    paused: { type: ControlType.Boolean, title: "Paused", defaultValue: false, enabledTitle: "Yes", disabledTitle: "No", description: "Stop automatic animation and pointer interactions." },
})
