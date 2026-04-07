import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, Twitter, Facebook, ArrowDown,
  User, Mail, MapPin, Calendar, ChevronRight,
  CheckCircle, Menu, X
} from 'lucide-react';

const FLAVORS = [
  { id: 1, name: "Dark Velvet Truffle",      description: "72% Venezuelan dark chocolate folded into rich ganache with flakes of edible 24k gold.", image: "/images/flavor-1.png", video: "/videos/flavor-1.mp4", note: "Limited Edition" },
  { id: 2, name: "Champagne & Rose",          description: "Vintage cuvée blended with delicate Damask rose petals and crystallised strawberries.",      image: "/images/flavor-2.png", video: "/videos/flavor-2.mp4", note: "Seasonal"       },
  { id: 3, name: "Tahitian Vanilla Noir",     description: "The rarest double-fermented vanilla beans, steeped in cream for 48 hours.",                  image: "/images/flavor-3.png", video: "/videos/flavor-3.mp4", note: "Signature"      },
  { id: 4, name: "Black Sesame & Honey",      description: "Roasted black sesame paste swirled with raw honeycomb from high-altitude alpine apiaries.",   image: "/images/flavor-4.png", video: "/videos/flavor-4.mp4", note: "Chef's Pick"   },
  { id: 5, name: "Salted Caramel Obsession",  description: "Slow-burnt caramel laced with hand-harvested fleur de sel from the Brittany coast.",          image: "/images/flavor-5.png", video: "/videos/flavor-5.mp4", note: "Bestseller"    },
  { id: 6, name: "Midnight Espresso",         description: "Single-origin Ethiopian coffee beans, cold-extracted to capture absolute purity.",             image: "/images/flavor-6.png", video: "/videos/flavor-6.mp4", note: "Signature"      },
];

const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS      = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const LOCATIONS = ['Paris — Le Marais','London — Mayfair','New York — SoHo','Tokyo — Ginza','Dubai — Downtown'];

const PRELOAD_IMAGES = [
  '/images/hero-chocolate.png',
  '/images/flavor-1.png', '/images/flavor-2.png', '/images/flavor-3.png',
  '/images/flavor-4.png', '/images/flavor-5.png', '/images/flavor-6.png',
];

export default function VelvetScoop() {
  const currentYear  = new Date().getFullYear();
  const YEARS        = [String(currentYear), String(currentYear + 1)];

  /* ── Loading / preloader ── */
  const [loadedCount,   setLoadedCount]   = useState(0);
  const [minTimeDone,   setMinTimeDone]   = useState(false);
  const [loading,       setLoading]       = useState(true);

  const progress = Math.min(Math.round((loadedCount / PRELOAD_IMAGES.length) * 100), 100);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 2400);
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => setLoadedCount(c => c + 1);
      img.src = src;
    });
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (progress >= 100 && minTimeDone) setLoading(false);
  }, [progress, minTimeDone]);

  /* ── Site state ── */
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileMenu,    setMobileMenu]    = useState(false);
  const [mousePos,      setMousePos]      = useState({ x: -200, y: -200 });
  const [cursorHover,   setCursorHover]   = useState(false);
  const [aboutInView,   setAboutInView]   = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', location: LOCATIONS[0], month: '', day: '', year: '', occasion: ''
  });

  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAboutInView(true); },
      { threshold: 0.2 }
    );
    if (aboutRef.current) obs.observe(aboutRef.current);
    return () => obs.disconnect();
  }, []);

  /* close mobile menu on scroll */
  useEffect(() => {
    if (mobileMenu) {
      const close = () => setMobileMenu(false);
      window.addEventListener('scroll', close, { once: true, passive: true });
    }
  }, [mobileMenu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.month || !formData.day || !formData.year) return;
    setFormSubmitted(true);
  };

  const onHover  = () => setCursorHover(true);
  const offHover = () => setCursorHover(false);

  const cursorVariants = {
    default: { x: mousePos.x - 10, y: mousePos.y - 10, scale: 1,   opacity: 1   },
    hover:   { x: mousePos.x - 10, y: mousePos.y - 10, scale: 2.2, opacity: 0.8 },
  };
  const dotVariants = {
    default: { x: mousePos.x - 3, y: mousePos.y - 3, scale: 1 },
    hover:   { x: mousePos.x - 3, y: mousePos.y - 3, scale: 0 },
  };

  /* ── Staggered hero animations after loader ── */
  const heroVars = (delay: number) => ({
    initial:    { opacity: 0, y: 30 },
    animate:    loading ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.76, 0, 0.24, 1] as const },
  });

  return (
    <div className="bg-[#080503] min-h-screen text-[#f5efe6] overflow-x-hidden">

      {/* ─── Custom Cursor (desktop only) ─── */}
      {!loading && (
        <>
          <motion.div
            variants={cursorVariants}
            animate={cursorHover ? "hover" : "default"}
            transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.6 }}
            className="fixed top-0 left-0 w-5 h-5 rounded-full border border-[#D4AF37] pointer-events-none z-[9999] hidden md:block"
          />
          <motion.div
            variants={dotVariants}
            animate={cursorHover ? "hover" : "default"}
            transition={{ type: "spring", stiffness: 800, damping: 30 }}
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#D4AF37] pointer-events-none z-[9999] hidden md:block"
          />
        </>
      )}

      {/* ─── Preloader ─── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9998] bg-[#080503] flex flex-col items-center justify-center gap-8 px-8"
          >
            <div className="relative text-center">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="h-px w-28 sm:w-36 bg-[#D4AF37] mb-6 mx-auto origin-left"
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="text-4xl sm:text-6xl md:text-7xl tracking-[0.25em] text-[#D4AF37] relative overflow-hidden"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                VELVET SCOOP
                <motion.span
                  initial={{ x: "-110%" }}
                  animate={{ x: "110%" }}
                  transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                />
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                className="h-px w-28 sm:w-36 bg-[#D4AF37] mt-6 mx-auto origin-right"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]"
            >
              Haute Patisserie
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-36 sm:w-48"
            >
              <div className="h-px bg-[#D4AF37]/15 w-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#D4AF37]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 text-center text-[9px] tracking-[0.3em] text-[#D4AF37]/35 tabular-nums">
                {progress}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Navbar ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={loading ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-[#080503]/95 backdrop-blur-lg border-b border-[#D4AF37]/15 py-3 md:py-4" : "bg-transparent py-5 md:py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-serif text-xl md:text-2xl text-[#D4AF37]"
            style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.3em' }}
            onMouseEnter={onHover} onMouseLeave={offHover}
            whileHover={{ letterSpacing: '0.4em' }}
            transition={{ duration: 0.4 }}
          >
            VS
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12 text-[11px] tracking-[0.25em] uppercase text-[#ede0d0]/60">
            {['Collections', 'Philosophy', 'Reserve'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group"
                onMouseEnter={onHover} onMouseLeave={offHover}
                initial={{ opacity: 0, y: -10 }}
                animate={loading ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <span className="group-hover:text-[#D4AF37] transition-colors duration-300">{item}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#D4AF37] p-1 focus:outline-none"
            onClick={() => setMobileMenu(p => !p)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="md:hidden overflow-hidden bg-[#080503]/98 backdrop-blur-xl border-b border-[#D4AF37]/10"
            >
              <div className="px-6 pb-6 pt-2 flex flex-col gap-6">
                {['Collections', 'Philosophy', 'Reserve'].map(item => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenu(false)}
                    className="text-[12px] tracking-[0.35em] uppercase text-[#ede0d0]/60 hover:text-[#D4AF37] transition-colors duration-300 py-1 border-b border-[#D4AF37]/8"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080503]/60 via-[#080503]/20 to-[#080503] z-10" />
          <div className="absolute inset-0 bg-[#080503]/25 z-10" />
          <video
            autoPlay muted loop playsInline
            poster="/images/hero-chocolate.png"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-4 sm:px-6 w-full">
          <motion.div {...heroVars(0.05)} className="mb-4 sm:mb-6">
            <span className="text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#D4AF37]/70">
              Est. Paris, 2012
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={loading ? { y: 80, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1.3, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
              className="font-serif leading-[0.9] tracking-[0.08em] sm:tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-br from-[#C9A84C] via-[#f5efe6] to-[#8B6914] shimmer-text"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(3.5rem, 14vw, 11rem)',
              }}
            >
              VELVET<br />SCOOP
            </motion.h1>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={loading ? { scaleX: 0 } : { scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="h-px w-32 sm:w-48 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6 sm:my-8"
          />

          <motion.p {...heroVars(0.55)}
            className="text-[#ede0d0]/70 tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs max-w-xs sm:max-w-sm mx-auto font-light"
          >
            Haute Patisserie in a Single Perfect Sphere
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          {...heroVars(0.8)}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] sm:text-[9px] tracking-[0.5em] uppercase text-[#D4AF37]/40">Descend</span>
          <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]/50 animate-bounce" />
        </motion.div>
      </section>

      {/* ─── Thin Divider ─── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* ─── Marquee ─── */}
      <div className="bg-[#D4AF37]/8 py-3 sm:py-4 overflow-hidden border-y border-[#D4AF37]/10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[#D4AF37]/50 px-8 sm:px-12">
              Velvet Scoop &mdash; Paris &mdash; Luxury &mdash; Crafted with Obsession &mdash; Est. 2012
            </span>
          ))}
        </motion.div>
      </div>

      {/* ─── Flavors Collection ─── */}
      <section id="collections" className="py-20 sm:py-28 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1 }}
            className="text-center mb-16 sm:mb-20 lg:mb-28"
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-[#D4AF37]/50 mb-3 block">
              The Collection
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#f5efe6] mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Masterpieces
            </h2>
            <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto mb-5" />
            <p className="text-[#ede0d0]/50 max-w-sm sm:max-w-xl mx-auto font-light leading-relaxed text-xs sm:text-sm">
              Crafted in limited quantities using the world's most elusive ingredients.
              Each flavor is a study in absolute indulgence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-14 sm:gap-y-16 lg:gap-y-20">
            {FLAVORS.map((flavor, index) => (
              <FlavorCard
                key={flavor.id}
                flavor={flavor}
                index={index}
                onHover={onHover}
                offHover={offHover}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* ─── Philosophy ─── */}
      <section
        id="philosophy"
        ref={aboutRef}
        className="py-20 sm:py-28 lg:py-36 bg-[#060402] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#D4AF37 0px,#D4AF37 1px,transparent 0px,transparent 50%)", backgroundSize: "20px 20px" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-[#D4AF37]/50 mb-5 block">
                Our Story
              </span>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#D4AF37] mb-8 sm:mb-10 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Crafted from<br />Obsession
              </h2>
              <div className="space-y-5 text-[#ede0d0]/65 font-light leading-relaxed text-sm sm:text-base">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  We do not make ice cream. We curate moments of absolute indulgence. Born in a subterranean kitchen in Paris, Velvet Scoop began as a rebellion against the ordinary.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                >
                  Every ingredient is obsessively sourced. We wait months for the perfect vanilla harvest. We employ master chocolatiers to temper our stracciatella. True luxury takes time, patience, and an uncompromising dedication to craft.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-[#D4AF37] italic text-lg sm:text-xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  "To taste it is to understand."
                </motion.p>
              </div>
            </motion.div>

            {/* Stats column */}
            <div className="border border-[#D4AF37]/15 mt-4 lg:mt-0">
              <StatItem label="Years of Obsession" target={12}  suffix=""  inView={aboutInView} />
              <StatItem label="Scoops Served"       target={2.4} suffix="M" decimals={1} inView={aboutInView} />
              <StatItem label="Global Awards"        target={47}  suffix=""  inView={aboutInView} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* ─── Reserve ─── */}
      <section id="reserve" className="py-20 sm:py-28 lg:py-36 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-[#D4AF37]/50 mb-3 block">
              Exclusively By Appointment
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#f5efe6] mb-4 sm:mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Reserve Your<br />Experience
            </h2>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto mb-4 sm:mb-5" />
            <p className="text-[#ede0d0]/45 font-light text-xs sm:text-sm">
              Velvet Scoop is available exclusively by reservation in select boutiques globally.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="bg-[#0d0806] border border-[#D4AF37]/30 p-8 sm:p-12 md:p-16 text-center relative"
              >
                <CornerBrackets />
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 18 }}
                  className="mb-6 sm:mb-8"
                >
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#D4AF37] mx-auto" strokeWidth={1} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-3 sm:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Reservation Received
                  </h3>
                  <p className="text-[#ede0d0]/60 font-light mb-2 text-sm sm:text-base">
                    Thank you, <span className="text-[#f5efe6]">{formData.name}</span>.
                  </p>
                  <p className="text-[#ede0d0]/50 font-light text-xs sm:text-sm mb-2">
                    Your experience has been reserved for{" "}
                    <span className="text-[#D4AF37]">{formData.month} {formData.day}, {formData.year}</span>
                    {" "}at <span className="text-[#D4AF37]">{formData.location}</span>.
                  </p>
                  <p className="text-[#ede0d0]/40 text-[9px] sm:text-xs tracking-widest uppercase mt-5 sm:mt-6">
                    A confirmation has been sent to {formData.email}
                  </p>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', location: LOCATIONS[0], month: '', day: '', year: '', occasion: '' });
                  }}
                  className="mt-8 sm:mt-10 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/20 pb-1"
                >
                  Make another reservation
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                onSubmit={handleSubmit}
                className="bg-[#0d0806] border border-[#D4AF37]/20 p-6 sm:p-10 md:p-14 relative"
              >
                <CornerBrackets />

                <div className="space-y-8 sm:space-y-10">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <FieldGroup label="Full Name" icon={<User size={11} />}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        required
                        placeholder="Monsieur / Madame"
                        className="w-full bg-transparent border-b border-[#ede0d0]/15 pb-3 text-[#f5efe6] placeholder:text-[#ede0d0]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300 font-light text-sm"
                      />
                    </FieldGroup>
                    <FieldGroup label="Email Address" icon={<Mail size={11} />}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        required
                        placeholder="contact@example.com"
                        className="w-full bg-transparent border-b border-[#ede0d0]/15 pb-3 text-[#f5efe6] placeholder:text-[#ede0d0]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300 font-light text-sm"
                      />
                    </FieldGroup>
                  </div>

                  {/* Location */}
                  <FieldGroup label="Boutique Location" icon={<MapPin size={11} />}>
                    <LuxurySelect
                      value={formData.location}
                      onChange={val => setFormData(p => ({ ...p, location: val }))}
                      options={LOCATIONS.map(l => ({ value: l, label: l }))}
                      placeholder="Select Location"
                    />
                  </FieldGroup>

                  {/* Date */}
                  <FieldGroup label="Preferred Date" icon={<Calendar size={11} />}>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <LuxurySelect
                        value={formData.month}
                        onChange={val => setFormData(p => ({ ...p, month: val }))}
                        options={MONTHS.map(m => ({ value: m, label: m }))}
                        placeholder="Month"
                      />
                      <LuxurySelect
                        value={formData.day}
                        onChange={val => setFormData(p => ({ ...p, day: val }))}
                        options={DAYS.map(d => ({ value: d, label: d }))}
                        placeholder="Day"
                      />
                      <LuxurySelect
                        value={formData.year}
                        onChange={val => setFormData(p => ({ ...p, year: val }))}
                        options={YEARS.map(y => ({ value: y, label: y }))}
                        placeholder="Year"
                      />
                    </div>
                  </FieldGroup>

                  {/* Occasion */}
                  <FieldGroup label="Occasion (Optional)" icon={<ChevronRight size={11} />}>
                    <input
                      type="text"
                      value={formData.occasion}
                      onChange={e => setFormData(p => ({ ...p, occasion: e.target.value }))}
                      placeholder="Anniversary, Birthday, Private Gathering…"
                      className="w-full bg-transparent border-b border-[#ede0d0]/15 pb-3 text-[#f5efe6] placeholder:text-[#ede0d0]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300 font-light text-sm"
                    />
                  </FieldGroup>
                </div>

                {/* Submit */}
                <div className="mt-10 sm:mt-12 flex justify-center">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={onHover} onMouseLeave={offHover}
                    className="group relative px-10 sm:px-14 py-3.5 sm:py-4 bg-[#D4AF37] text-[#080503] text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] sm:tracking-[0.3em] uppercase overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      Request Reservation
                      <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-[#f5efe6] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#040302] border-t border-[#D4AF37]/10 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-2xl sm:text-3xl tracking-[0.3em] text-[#D4AF37]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              VELVET SCOOP
            </motion.h2>
            <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
            <div className="flex items-center gap-6 sm:gap-8">
              {[{ Icon: Instagram, label: 'Instagram' }, { Icon: Twitter, label: 'Twitter' }, { Icon: Facebook, label: 'Facebook' }].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-[#ede0d0]/30 hover:text-[#D4AF37] transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  onMouseEnter={onHover} onMouseLeave={offHover}
                >
                  <Icon size={17} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
            <p className="text-[#ede0d0]/20 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase">
              &copy; {new Date().getFullYear()} Velvet Scoop. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Global styles ─── */}
      <style>{`
        @media (pointer: fine) { * { cursor: none !important; } }

        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shimmer-text {
          background-size: 300% auto;
          animation: shimmer 8s linear infinite;
        }

        input::placeholder { color: rgba(237,224,208,0.25); }
      `}</style>
    </div>
  );
}

/* ─── Corner brackets decoration ─── */
function CornerBrackets() {
  return (
    <>
      <div className="absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-[#D4AF37]" />
    </>
  );
}

/* ─── Luxury Custom Select ─── */
function LuxurySelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full bg-[#0a0604] border border-[#D4AF37]/30 text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-light transition-colors duration-300 flex items-center justify-between focus:outline-none focus:border-[#D4AF37] hover:border-[#D4AF37]/60"
        style={{ color: selected ? '#f5efe6' : 'rgba(237,224,208,0.35)' }}
      >
        <span className="truncate pr-2">{selected ? selected.label : placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 270 : 90 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0"
        >
          <ChevronRight className="w-3 h-3 text-[#D4AF37]/50" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 z-[200] mt-1 bg-[#0d0806] border border-[#D4AF37]/30 max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-light transition-colors duration-150 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                style={{ color: opt.value === value ? '#D4AF37' : 'rgba(245,239,230,0.7)' }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Flavor Card ─── */
function FlavorCard({
  flavor, index, onHover, offHover,
}: {
  flavor: typeof FLAVORS[0];
  index: number;
  onHover: () => void;
  offHover: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const active = isHovered || isTouched;

  const handleTouchEnd = () => {
    setIsTouched(p => !p);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.85, delay: (index % 3) * 0.1, ease: [0.76, 0, 0.24, 1] }}
      className="group cursor-pointer select-none"
      onMouseEnter={() => { setIsHovered(true); onHover(); }}
      onMouseLeave={() => { setIsHovered(false); offHover(); }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden aspect-[3/4] mb-5 sm:mb-6">
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#080503] via-transparent to-transparent z-10 transition-opacity duration-700"
          style={{ opacity: active ? 0.3 : 0.7 }}
        />
        {/* Gold ring */}
        <div
          className="absolute inset-0 transition-all duration-700 z-20 pointer-events-none"
          style={{ boxShadow: active ? 'inset 0 0 0 1px rgba(212,175,55,0.5)' : 'inset 0 0 0 1px rgba(212,175,55,0)' }}
        />

        {/* Static image — fades out on hover/touch */}
        <motion.img
          src={flavor.image}
          alt={flavor.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: active ? 0 : 1, scale: active ? 1.04 : 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Video — fades in on hover/touch */}
        <motion.video
          src={flavor.video}
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Note badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
          <span className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#080503]/60 backdrop-blur-sm">
            {flavor.note}
          </span>
        </div>
      </div>

      <motion.div
        className="text-center"
        animate={{ y: active ? -4 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="h-px bg-[#D4AF37]/40 mx-auto mb-3 sm:mb-4 transition-all duration-500"
          style={{ width: active ? '4rem' : '2rem' }}
        />
        <h3
          className="text-lg sm:text-xl font-serif mb-1.5 sm:mb-2 transition-colors duration-500"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: active ? '#D4AF37' : '#f5efe6' }}
        >
          {flavor.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#ede0d0]/45 leading-relaxed font-light px-2 sm:px-0">
          {flavor.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Field Group ─── */
function FieldGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2 sm:space-y-2.5">
      <label className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-[#D4AF37]/60">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Stat Item ─── */
function StatItem({ label, target, suffix, decimals = 0, inView }: {
  label: string; target: number; suffix: string; decimals?: number; inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const duration = 2200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(target * ease);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group border-b border-[#D4AF37]/10 last:border-b-0 py-8 sm:py-10 px-6 sm:px-10 text-center relative overflow-hidden hover:bg-[#D4AF37]/3 transition-colors duration-500"
    >
      <div className="absolute bottom-0 left-0 h-px w-0 bg-[#D4AF37]/40 group-hover:w-full transition-all duration-700" />
      <div
        className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#f5efe6] mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/50">{label}</div>
    </motion.div>
  );
}
