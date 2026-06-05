'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from '../components/ThemeSwitcher'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS: Record<string, string[]> = {
  Languages: ['TypeScript', 'Rust', 'Python', 'Go', 'SQL', 'GLSL'],
  Frameworks: ['Next.js', 'React', 'Node.js', 'FastAPI', 'Axum', 'tRPC'],
  Infrastructure: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Vercel', 'Cloudflare'],
  Tooling: ['PostgreSQL', 'Redis', 'GraphQL', 'WebSockets', 'Prisma', 'Drizzle'],
}

const PROJECTS = [
  {
    id: '001',
    name: 'Helix OS',
    tag: 'Systems',
    desc: 'A browser-based OS emulator with real process scheduling, virtual file system, and WASM compilation pipeline. Built to teach OS fundamentals without a VM.',
    stack: ['Rust', 'WASM', 'React', 'WebWorkers'],
    status: 'live' as const,
    year: '2024',
    size: 'large' as const,
  },
  {
    id: '002',
    name: 'Vanta Query',
    tag: 'DevTools',
    desc: 'Zero-config SQL editor with AI-assisted query building, visual explain plans, and time-travel diff for schema migrations.',
    stack: ['TypeScript', 'PostgreSQL', 'OpenAI'],
    status: 'live' as const,
    year: '2024',
    size: 'medium' as const,
  },
  {
    id: '003',
    name: 'Meridian',
    tag: 'Platform',
    desc: 'Distributed task orchestration processing 2.3M jobs/day with sub-millisecond scheduling precision and zero single points of failure.',
    stack: ['Go', 'Redis', 'gRPC', 'Kubernetes'],
    status: 'live' as const,
    year: '2023',
    size: 'medium' as const,
  },
  {
    id: '004',
    name: 'Spectra UI',
    tag: 'Design System',
    desc: '74 primitives with runtime theme generation, WCAG AAA compliance, and zero runtime CSS-in-JS overhead.',
    stack: ['React', 'Vanilla Extract', 'Radix', 'Storybook'],
    status: 'oss' as const,
    year: '2023',
    size: 'small' as const,
  },
  {
    id: '005',
    name: 'Forge CLI',
    tag: 'DevTools',
    desc: 'Project scaffolding with opinionated configs, automated dependency audits, and GitHub Actions integration out of the box.',
    stack: ['Node.js', 'Ink', 'Commander'],
    status: 'oss' as const,
    year: '2023',
    size: 'small' as const,
  },
]

const STATS = [
  { value: '7+', label: 'Years Engineering' },
  { value: '43', label: 'Projects Shipped' },
  { value: '12', label: 'OSS Repos' },
  { value: '~4k', label: 'Commits / year' },
]

const CODE_LINES = [
  'const buildSomething = async () => {',
  '  const vision = await conceptualize()',
  '  const arch = design(vision)',
  '  const code = await implement(arch)',
  '  return deploy({',
  '    code,',
  '    precision: "max",',
  '  })',
  '}',
  '',
  '// Codecraft · Taylor Industries',
  'buildSomething().then(ship)',
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function TerminalWindow() {
  const [lines, setLines] = useState<string[]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (lineIdx >= CODE_LINES.length) return
    const line = CODE_LINES[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 32 + Math.random() * 18)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setLines((prev) => [...prev, line])
      setLineIdx((l) => l + 1)
      setCharIdx(0)
    }, 70)
    return () => clearTimeout(t)
  }, [lineIdx, charIdx])

  const partial = lineIdx < CODE_LINES.length ? CODE_LINES[lineIdx].slice(0, charIdx) : ''

  const colorLine = (line: string, i: number) => {
    const lno = (
      <span key={`ln-${i}`} style={{ color: 'var(--color-text-secondary)', opacity: 0.35 }} className="mr-4 select-none text-xs">
        {String(i + 1).padStart(2, '0')}
      </span>
    )
    if (line.startsWith('//'))
      return <div key={i} className="leading-6"><span style={{ opacity: 0.45, color: 'var(--color-accent)' }}>{lno}{line}</span></div>
    if (/^(const|return|async)/.test(line))
      return (
        <div key={i} className="leading-6">
          {lno}
          <span style={{ color: 'var(--color-accent-light)' }}>{line.match(/^(const|return|async\s+)/)?.[0]}</span>
          {line.replace(/^(const|return|async\s+)/, '')}
        </div>
      )
    return <div key={i} className="leading-6">{lno}{line}</div>
  }

  return (
    <div className="font-code text-sm rounded-lg overflow-hidden transition-theme"
      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-secondary)' }}>
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,90,90,0.7)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,190,50,0.7)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(40,200,90,0.7)' }} />
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>portfolio.ts — Codecraft</span>
      </div>
      <div className="p-5 space-y-0.5 min-h-64">
        {lines.map((line, i) => colorLine(line, i))}
        {lineIdx < CODE_LINES.length && (
          <div className="leading-6">
            <span style={{ color: 'var(--color-text-secondary)', opacity: 0.35 }} className="mr-4 select-none text-xs">
              {String(lineIdx + 1).padStart(2, '0')}
            </span>
            {partial}
            {blink && (
              <span className="inline-block w-2 h-4 ml-px align-text-bottom" style={{ background: 'var(--color-accent)' }} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }} className="mb-14">
      <div className="font-code text-xs tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
        /{number}/
      </div>
      <h2 className="font-display text-5xl md:text-7xl" style={{ color: 'var(--color-text)' }}>
        {title}
      </h2>
      <div className="mt-4 w-14 h-px" style={{ background: 'var(--color-accent)' }} />
    </motion.div>
  )
}

const statusDot: Record<string, string> = {
  live: '#4ade80',
  oss: '#60a5fa',
  wip: '#facc15',
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hov, setHov] = useState(false)

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09, duration: 0.55 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className={`relative rounded-lg overflow-hidden transition-theme ${project.size === 'large' ? 'md:col-span-2' : ''}`}
      style={{
        background: 'var(--color-bg-card)',
        border: `1px solid ${hov ? 'var(--color-accent)' : 'var(--color-border)'}`,
        boxShadow: hov ? '0 0 0 1px rgba(var(--accent-rgb),0.3), 0 0 28px rgba(var(--accent-rgb),0.1)' : 'none',
      }}>
      <div className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)', opacity: hov ? 1 : 0 }} />
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-code text-xs tracking-widest mb-1" style={{ color: 'rgba(var(--accent-rgb),0.55)' }}>
              {project.id} / {project.tag}
            </div>
            <h3 className="font-display text-4xl" style={{ color: 'var(--color-text)' }}>{project.name}</h3>
          </div>
          <div className="flex items-center gap-2 mt-1 shrink-0">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusDot[project.status] }} />
            <span className="font-code text-xs" style={{ color: 'var(--color-text-secondary)' }}>{project.status}</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>{project.desc}</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span key={t} className="font-code text-xs px-2 py-1 rounded transition-theme"
                style={{ background: 'var(--color-secondary)', color: 'rgba(var(--accent-rgb),0.75)', border: '1px solid rgba(var(--accent-rgb),0.15)' }}>
                {t}
              </span>
            ))}
          </div>
          <span className="font-code text-xs" style={{ color: 'rgba(var(--color-text-secondary),0.35)', opacity: 0.4 }}>{project.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('sent')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-primary)' }}>
      {/* Scroll progress */}
      <motion.div className="fixed top-0 left-0 h-0.5 z-50 origin-left"
        style={{ width: progressWidth, background: 'var(--color-accent)' }} />

      {/* Ambient grid */}
      <div className="fixed inset-0 bg-grid-lines pointer-events-none z-0" />

      {/* Radial glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)' }} />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-40 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}
            className="font-code text-sm">
            <span style={{ color: 'var(--color-accent)' }}>CC</span>
            <span className="mx-2" style={{ color: 'var(--color-text-secondary)' }}>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>Taylor Industries</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}
            className="flex items-center gap-6">
            {['about', 'work', 'contact'].map((s) => (
              <a key={s} href={`#${s}`}
                className="font-code text-xs tracking-widest uppercase transition-theme hidden md:block hover:opacity-100"
                style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                {s}
              </a>
            ))}
            <ThemeSwitcher />
          </motion.div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-5 gap-10 md:gap-16 items-center relative z-10">

          {/* Left: Name */}
          <div className="md:col-span-3">
            <motion.div initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
              className="font-code text-sm tracking-widest mb-7" style={{ color: 'var(--color-accent)' }}>
              $ whoami
            </motion.div>

            <div className="overflow-hidden mb-1">
              <motion.h1 initial={{ y: '105%' }} animate={heroInView ? { y: 0 } : {}}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none" style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)', color: 'var(--color-text)' }}>
                TAYLOR
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1 initial={{ y: '105%' }} animate={heroInView ? { y: 0 } : {}}
                transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none text-glow" style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)', color: 'var(--color-accent)' }}>
                INDUSTRIES
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 18 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.38, duration: 0.55 }}
              className="text-lg leading-relaxed max-w-lg mb-10" style={{ color: 'var(--color-text-secondary)' }}>
              Systems architect and full-stack engineer. Building precise, performant software for problems worth solving.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }} className="flex gap-4 flex-wrap">
              <a href="#work" className="font-code text-sm tracking-wider px-6 py-3 rounded transition-theme font-semibold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                VIEW WORK
              </a>
              <a href="#contact" className="font-code text-sm tracking-wider px-6 py-3 rounded transition-theme font-semibold"
                style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
                GET IN TOUCH
              </a>
            </motion.div>
          </div>

          {/* Right: Terminal + mini stats */}
          <motion.div className="md:col-span-2" initial={{ opacity: 0, x: 32 }} animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.65 }}>
            <TerminalWindow />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {STATS.slice(0, 2).map((s) => (
                <div key={s.label} className="glass-effect-accent rounded-lg p-4 transition-theme">
                  <div className="font-display text-3xl" style={{ color: 'var(--color-accent)' }}>{s.value}</div>
                  <div className="font-code text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-code text-xs tracking-widest" style={{ color: 'rgba(var(--accent-rgb),0.45)' }}>SCROLL</span>
          <motion.div className="w-px h-10" animate={{ scaleY: [0, 1, 0], y: [0, 0, 10] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(to bottom, var(--color-accent), transparent)', transformOrigin: 'top' }} />
        </motion.div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 md:py-36 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="01" title="ABOUT" />
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div className="space-y-5">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Seven years at the intersection of systems thinking and product craft. I architect backends
                that scale without drama and build frontends that feel instant.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Currently focused on developer tooling and distributed systems. Previously built core
                infrastructure at a Series B fintech, led frontend architecture for a 0→1 SaaS, and
                contributed to several widely-used open source projects in the TypeScript ecosystem.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Outside of code: competitive chess (1847 ELO), film photography on a Contax T2,
                and an unreasonable obsession with mechanical keyboard firmware.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.45 }}
                  className="rounded-lg p-6 transition-theme"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div className="font-display text-4xl" style={{ color: 'var(--color-accent)' }}>{s.value}</div>
                  <div className="font-code text-xs mt-1 tracking-wider uppercase" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-36 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="02" title="ARSENAL" />
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(SKILLS).map(([cat, skills], ci) => (
              <motion.div key={cat}
                initial={{ opacity: 0, x: ci % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.55, delay: ci * 0.08 }}
                className="rounded-lg p-6 transition-theme"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                <div className="font-code text-xs tracking-widest mb-5" style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>
                  [{cat.toUpperCase()}]
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, si) => (
                    <motion.div key={skill}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.05 + si * 0.03, duration: 0.28 }}
                      whileHover={{ scale: 1.06 }}
                      className="px-3 py-1.5 font-code text-sm rounded cursor-default transition-theme"
                      style={{ color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────────── */}
      <section id="work" className="py-28 md:py-36 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="03" title="WORK" />
          <div className="grid md:grid-cols-3 gap-4">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 md:py-36 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionLabel number="04" title="CONTACT" />
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--color-text-secondary)' }}>
                Building something ambitious? Looking for a collaborator who cares about both the
                architecture and the pixels? Let's talk.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'hello@taylorindustries.dev' },
                  { label: 'GitHub', value: 'github.com/taylor-ind' },
                  { label: 'Location', value: 'Remote — Pacific Time' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-6 font-code text-sm">
                    <span className="w-20 shrink-0" style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>{item.label}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="font-code text-xs tracking-widest block mb-2" style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>
                    {f.label.toUpperCase()}
                  </label>
                  <input type={f.type} placeholder={f.placeholder} required
                    value={form[f.name as keyof typeof form]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    className="w-full px-4 py-3 rounded font-code text-sm outline-none transition-theme"
                    style={{
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
                </div>
              ))}
              <div>
                <label className="font-code text-xs tracking-widest block mb-2" style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>
                  MESSAGE
                </label>
                <textarea rows={5} placeholder="Tell me about your project..." required
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded font-code text-sm outline-none resize-none transition-theme"
                  style={{
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
              </div>
              <button type="submit" disabled={status !== 'idle'}
                className="w-full py-3 font-code text-sm tracking-wider rounded font-semibold transition-theme disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                {status === 'idle' && 'SEND MESSAGE'}
                {status === 'sending' && 'TRANSMITTING...'}
                {status === 'sent' && 'MESSAGE SENT'}
              </button>
              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="font-code text-xs text-center" style={{ color: 'var(--color-accent)' }}>
                    Got it. I'll be in touch within 48h.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 md:px-12 relative z-10" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-code text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            &copy; 2024 Taylor Industries. Built with precision.
          </span>
          <span className="font-code text-xs" style={{ color: 'rgba(var(--accent-rgb),0.35)' }}>v2.4.1</span>
        </div>
      </footer>
    </div>
  )
}
