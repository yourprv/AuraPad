import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  phase: number
}

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = [
      'rgba(250, 190, 0, 0.08)',
      'rgba(255, 200, 50, 0.06)',
      'rgba(253, 253, 231, 0.05)',
      'rgba(250, 190, 0, 0.04)',
      'rgba(200, 160, 30, 0.05)',
    ]

    // Initialize particles
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 200 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    let time = 0
    const animate = () => {
      time += 0.005
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw flowing aurora ribbons
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height * 0.3 + i * 80)

        for (let x = 0; x < canvas.width; x += 2) {
          const mouseInfluence = Math.sin((x - mouseRef.current.x) * 0.003) * 30
          const y =
            canvas.height * 0.3 +
            i * 80 +
            Math.sin(x * 0.002 + time + i) * 60 +
            Math.sin(x * 0.005 - time * 1.5 + i * 2) * 30 +
            mouseInfluence * (1 - i * 0.15)
          ctx.lineTo(x, y)
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, 'rgba(250, 190, 0, 0)')
        gradient.addColorStop(
          0.3 + i * 0.1,
          `rgba(250, 190, 0, ${0.03 + i * 0.01})`
        )
        gradient.addColorStop(
          0.7 - i * 0.05,
          `rgba(253, 253, 231, ${0.02 + i * 0.005})`
        )
        gradient.addColorStop(1, 'rgba(250, 190, 0, 0)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2 + i
        ctx.stroke()
      }

      // Draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.phase) * 0.2
        p.y += p.vy + Math.cos(time + p.phase) * 0.2

        // Mouse attraction
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) {
          p.vx += (dx / dist) * 0.01
          p.vy += (dy / dist) * 0.01
        }

        // Wrap around
        if (p.x < -p.radius) p.x = canvas.width + p.radius
        if (p.x > canvas.width + p.radius) p.x = -p.radius
        if (p.y < -p.radius) p.y = canvas.height + p.radius
        if (p.y > canvas.height + p.radius) p.y = -p.radius

        // Damping
        p.vx *= 0.999
        p.vy *= 0.999

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.alpha})`))
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
