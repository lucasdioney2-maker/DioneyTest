import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { empresa } from './config.js'

// ── Animações reutilizáveis ───────────────────────────────────────────────────
const fadeUp    = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }
const fadeIn    = { hidden: { opacity: 0 },         show: { opacity: 1 } }
const stagger   = { show: { transition: { staggerChildren: 0.12 } } }

function AnimWhen({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} className={className}
      variants={fadeUp} initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1], delay }}>
      {children}
    </motion.div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: empresa.accentColor }}>
        {empresa.nome}
      </span>
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#aaa' }}>
        {['Sobre','Serviços','Depoimentos','Contacto'].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`}
            style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = empresa.accentColor}
            onMouseLeave={e => e.target.style.color = '#aaa'}>
            {s}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const y     = useTransform(scrollY, [0, 500], [0, 120])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem',
      position: 'relative', overflow: 'hidden' }}>

      {/* Fundo com gradiente animado */}
      <motion.div style={{
        position: 'absolute', inset: 0, y,
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${empresa.accentColor}18 0%, transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div style={{ position: 'relative', zIndex: 1, maxWidth: 720, opacity }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ color: empresa.accentColor, fontSize: '0.85rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {empresa.categoria}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22,1,0.36,1] }}
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          {empresa.nome}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ fontSize: '1.15rem', color: '#999', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {empresa.tagline}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`tel:${empresa.telefone}`}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '0.85rem 2rem', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: empresa.accentColor, color: '#000', fontWeight: 700, fontSize: '0.95rem' }}>
              Ligar agora
            </motion.button>
          </a>
          <a href="#serviços">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '0.85rem 2rem', borderRadius: 99, cursor: 'pointer',
                background: 'transparent', color: '#fff', fontWeight: 500, fontSize: '0.95rem',
                border: '1px solid rgba(255,255,255,0.15)' }}>
              Ver serviços
            </motion.button>
          </a>
        </motion.div>

        {/* Badge de avaliações */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ marginTop: '3.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.5rem 1.2rem', borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)', fontSize: '0.9rem', color: '#aaa' }}>
          <span style={{ color: '#f5c542', fontSize: '1rem' }}>{'★'.repeat(5)}</span>
          <strong style={{ color: '#fff' }}>{empresa.estrelas}</strong>
          <span>·</span>
          <span>{empresa.avaliacoes} avaliações no Google</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Sobre ─────────────────────────────────────────────────────────────────────
function Sobre() {
  return (
    <section id="sobre" style={{ padding: '6rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <AnimWhen>
        <p style={{ color: empresa.accentColor, fontSize: '0.8rem', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Sobre nós
        </p>
        <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.2,
          marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Mais de 2000 clientes<br />
          <span style={{ color: empresa.accentColor }}>não podem estar errados.</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#888', lineHeight: 1.8, maxWidth: 640 }}>
          {empresa.descricao}
        </p>
      </AnimWhen>

      <motion.div variants={stagger} initial="hidden" whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginTop: '3rem' }}>
        {[
          { valor: empresa.avaliacoes, label: 'Avaliações Google' },
          { valor: empresa.estrelas + '⭐', label: 'Classificação média' },
          { valor: empresa.horario.split(':')[0], label: 'Horário de abertura' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp}
            style={{ padding: '1.5rem', borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: empresa.accentColor }}>{s.valor}</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ── Serviços ──────────────────────────────────────────────────────────────────
function Servicos() {
  return (
    <section id="serviços" style={{ padding: '6rem 1.5rem',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <AnimWhen style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: empresa.accentColor, fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            O que oferecemos
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Tudo o que precisas
          </h2>
        </AnimWhen>

        <motion.div variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }}>
          {empresa.servicos.map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              whileHover={{ y: -6, borderColor: `${empresa.accentColor}40` }}
              style={{ padding: '2rem 1.5rem', borderRadius: 20, cursor: 'default',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.3s' }}>
              <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>{s.icon}</p>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{s.titulo}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Depoimentos ───────────────────────────────────────────────────────────────
function Depoimentos() {
  return (
    <section id="depoimentos" style={{ padding: '6rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
      <AnimWhen style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p style={{ color: empresa.accentColor, fontSize: '0.8rem', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          O que dizem de nós
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {empresa.avaliacoes} avaliações falam por si
        </h2>
      </AnimWhen>

      <motion.div variants={stagger} initial="hidden" whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1.25rem' }}>
        {empresa.depoimentos.map((d, i) => (
          <motion.div key={i} variants={fadeUp}
            style={{ padding: '2rem', borderRadius: 20,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: '#f5c542', marginBottom: '1rem', fontSize: '1rem' }}>
              {'★'.repeat(d.estrelas)}
            </p>
            <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '1.2rem', fontSize: '0.95rem' }}>
              "{d.texto}"
            </p>
            <p style={{ color: '#555', fontSize: '0.85rem', fontWeight: 600 }}>— {d.nome}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ── Contacto ──────────────────────────────────────────────────────────────────
function Contacto() {
  return (
    <section id="contacto" style={{ padding: '6rem 1.5rem',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <AnimWhen>
          <p style={{ color: empresa.accentColor, fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Visita-nos
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700,
            letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Estamos à tua espera
          </h2>
          <p style={{ color: '#666', marginBottom: '3rem', fontSize: '1rem' }}>
            {empresa.morada}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a href={`tel:${empresa.telefone}`}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '0.85rem 2rem', borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: empresa.accentColor, color: '#000', fontWeight: 700 }}>
                📞 {empresa.telefone}
              </motion.button>
            </a>
            <a href={empresa.gmaps} target="_blank" rel="noopener">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '0.85rem 2rem', borderRadius: 99, cursor: 'pointer',
                  background: 'transparent', color: '#fff', fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.15)' }}>
                🗺️ Ver no Maps
              </motion.button>
            </a>
          </div>

          <div style={{ padding: '1.5rem', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)', fontSize: '0.9rem', color: '#666' }}>
            <strong style={{ color: '#aaa' }}>Horário: </strong>{empresa.horario}
          </div>
        </AnimWhen>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center', color: '#333', fontSize: '0.8rem' }}>
      <p>{empresa.nome} · {empresa.morada}</p>
      <p style={{ marginTop: '0.5rem' }}>
        Site criado por{' '}
        <a href="https://instagram.com/studio085pt" style={{ color: empresa.accentColor, textDecoration: 'none' }}>
          Studio 085
        </a>
      </p>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sobre />
      <Servicos />
      <Depoimentos />
      <Contacto />
      <Footer />
    </>
  )
}
