/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MessageCircle, ChevronLeft, Menu, X, MapPin, Phone, Clock, ShoppingBag, Calendar, Instagram } from 'lucide-react';
import OrderingSystem from './components/OrderingSystem';
import ReservationSystem from './components/ReservationSystem';

// Reusable Mughal-style ornamental divider
const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-3 opacity-80 w-full max-w-xs mx-auto">
    <div className="flex-1 h-[1px] bg-gradient-to-l from-gold/0 via-gold to-gold/0"></div>
    <div className="flex gap-1.5 items-center">
      <div className="w-1 h-1 rotate-45 bg-gold shadow-[0_0_8px_rgba(201,163,92,0.8)]"></div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold shrink-0">
        <path d="M12 1C12 1 14 8 18 12C14 16 12 23 12 23C12 23 10 16 6 12C10 8 12 1 12 1Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
      <div className="w-1 h-1 rotate-45 bg-gold shadow-[0_0_8px_rgba(201,163,92,0.8)]"></div>
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/0 via-gold to-gold/0"></div>
  </div>
);

// Reusable Gold Frame for images and cards
const GoldFrame = ({ children, className = "", noBg = false }: { children: React.ReactNode, className?: string, noBg?: boolean }) => (
  <div className={`relative p-1.5 group/frame ${className}`}>
    {/* Outer subtle glow */}
    <div className="absolute inset-0 bg-gold/5 blur-xl opacity-0 group-hover/frame:opacity-100 transition-opacity duration-700"></div>
    {/* Main Border */}
    <div className="absolute inset-0 border border-gold/20 group-hover/frame:border-gold/40 transition-colors duration-700"></div>
    {/* Corner Ornaments */}
    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-gold shadow-[0_0_10px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gold shadow-[0_0_10px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gold shadow-[0_0_10px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-gold shadow-[0_0_10px_rgba(201,163,92,0.3)]"></div>
    
    <div className={`relative h-full w-full ${noBg ? '' : 'bg-ink/80'}`}>
      {children}
    </div>
  </div>
);

const FireEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [0.2, 0.4, 0.2],
        y: [0, -10, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-40 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,80,0,0.3)_0%,_transparent_70%)] blur-[100px] will-change-transform"
    />
  </div>
);

const SpiceParticles = () => {
  const [particleCount, setParticleCount] = useState(20);
  
  useEffect(() => {
    if (window.innerWidth < 768) setParticleCount(8);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, "-=100"],
            opacity: [0, 0.3, 0],
            x: [null, i % 2 === 0 ? "+=15" : "-=15"]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 10 
          }}
          className="absolute w-1 h-1 bg-gold/30 rounded-full blur-[1px] will-change-transform"
        />
      ))}
    </div>
  );
};

const SmokeEffect = () => {
  const [smokeCount, setSmokeCount] = useState(5);
  
  useEffect(() => {
    if (window.innerWidth < 768) setSmokeCount(2);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {[...Array(smokeCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: (i * 25) + "%", 
            y: "110%",
            opacity: 0,
            scale: 1,
            rotate: 0
          }}
          animate={{ 
            y: "-20%",
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 2],
            rotate: [0, 45, 90],
            x: [(i * 25) + "%", (i * 25 + (i % 2 === 0 ? 5 : -5)) + "%"]
          }}
          transition={{ 
            duration: 15 + Math.random() * 5, 
            repeat: Infinity, 
            delay: i * 3,
            ease: "linear"
          }}
          className="absolute w-64 h-64 bg-white/5 rounded-full blur-[80px] will-change-transform"
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrdering, setShowOrdering] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const backgroundY = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '30%']);
  const backgroundYFast = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '50%']);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Lazy load the background video after page mount to improve initial LCP
    const timer = setTimeout(() => setIsVideoLoaded(true), 1500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-ink overflow-hidden relative text-beige" dir="rtl">
      {/* Global Deep Burgundy & Ink Base */}
      <div className="fixed inset-0 z-[-2] bg-ink"></div>
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_#0a0a0a_100%)] opacity-60"></div>

      {/* Global Vignette for Cinematic Depth */}
      <div className="pointer-events-none fixed inset-0 z-[85] shadow-[inset_0_0_200px_rgba(0,0,0,0.95)]"></div>

      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Global Mandala Background */}
      <div className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')` }}></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-ink/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://i.postimg.cc/kGFwP47g/599946786-1155252650100970-534780702069780137-n-removebg-preview.png" 
              alt="Karvin Massala Logo" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="text-2xl md:text-3xl font-serif text-gold hidden sm:block">
              Karvin Massala
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse text-base font-medium">
            <a href="#story" className="hover:text-gold transition-colors duration-300">القصة</a>
            <a href="#menu" className="hover:text-gold transition-colors duration-300">المنيو</a>
            <a href="#atmosphere" className="hover:text-gold transition-colors duration-300">الأجواء</a>
            <button 
              onClick={() => setShowReservation(true)}
              className="flex items-center gap-2 text-gold hover:text-white transition-colors duration-300"
            >
              <Calendar size={18} />
              حجز طاولة
            </button>
            <button 
              onClick={() => setShowOrdering(true)}
              className="flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-ink px-6 py-2 rounded-full transition-all duration-300"
            >
              <ShoppingBag size={18} />
              طلب أونلاين
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-ink pt-24 px-6 flex flex-col space-y-8 text-center"
          >
            <a href="#story" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-beige hover:text-gold">القصة</a>
            <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-beige hover:text-gold">المنيو</a>
            <a href="#atmosphere" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-beige hover:text-gold">الأجواء</a>
            <button 
              onClick={() => {
                setShowReservation(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-3 text-gold text-xl hover:text-white transition-colors"
            >
              <Calendar size={20} />
              حجز طاولة
            </button>
            <button 
              onClick={() => {
                setShowOrdering(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-3 border border-gold text-gold bg-transparent px-6 py-3 rounded-full text-lg mx-auto w-full max-w-xs hover:bg-gold hover:text-ink transition-all duration-300"
            >
              <ShoppingBag size={20} />
              طلب أونلاين
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax feel */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ y: backgroundY }}
            className="w-full h-[130%] -top-[15%] relative overflow-hidden bg-ink"
          >
            {/* Placeholder Image for instant loading on mobile */}
            <img 
              src="https://i.postimg.cc/BZ18vkWm/603910843-1158338549792380-6615533859420913573-n-(1).jpg" 
              alt="Background Placeholder" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            {isVideoLoaded && (
              <iframe
                src="https://player.vimeo.com/video/1179398009?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1&dnt=1"
                className="absolute top-1/2 left-1/2 w-[177.77vh] h-[100vh] min-w-[100vw] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 mix-blend-luminosity"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Background Video"
                loading="lazy"
              ></iframe>
            )}
            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-transparent to-ink/90"></div>
            <div className="absolute inset-0 bg-spotlight mix-blend-overlay opacity-80"></div>
          </motion.div>
        </div>

        <FireEffect />
        <SpiceParticles />
        <SmokeEffect />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight text-white"
          >
            رحلة إلى بلاد الهند..<br />
            <span className="text-gold">في قلب كارفين ماسالا</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
          >
            <OrnamentalDivider />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-beige/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            استمتع بتجربة Fine Dining استثنائية تمزج بين توابل الهند العريقة وأرقى الأطباق العالمية في أجواء راقية
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setShowReservation(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-ink bg-gold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(201,163,92,0.4)] w-full sm:w-auto"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-transparent transition-colors"></span>
              <span className="relative flex items-center gap-2">
                احجز طاولة الآن <Calendar size={18} />
              </span>
            </button>
            <button 
              onClick={() => setShowOrdering(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gold border border-gold rounded-full overflow-hidden transition-all hover:bg-gold hover:text-ink hover:shadow-[0_0_30px_rgba(201,163,92,0.4)] w-full sm:w-auto"
            >
              <span className="relative flex items-center gap-2">
                طلب أونلاين <ShoppingBag size={18} />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Fire & Cooking Section (Story 1) */}
      <section id="story-fire" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: backgroundYFast }} className="w-full h-[150%] -top-[25%] relative">
            <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-10 mix-blend-luminosity" alt="Tandoor Fire" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink"></div>
            <div className="absolute inset-0 bg-spotlight mix-blend-overlay opacity-50"></div>
          </motion.div>
        </div>

        <FireEffect />
        <SpiceParticles />
        <SmokeEffect />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="order-1 relative flex flex-col gap-6"
            >
              <GoldFrame className="h-[350px] md:h-[450px] overflow-hidden border-0">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="https://i.postimg.cc/dVn3XKd9/629473171-1193089626317272-8476822370379923342-n.jpg" 
                    alt="Tandoor Art" 
                    className="w-full h-full object-cover brightness-75 hover:brightness-100 hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
                </div>
              </GoldFrame>
              <GoldFrame className="h-[200px] md:h-[250px] self-end w-2/3 -mt-20 z-10 overflow-hidden border-0">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1000&auto=format&fit=crop" 
                    alt="Chef Cooking" 
                    className="w-full h-full object-cover brightness-75 hover:brightness-100 hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
                </div>
              </GoldFrame>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-2"
            >
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-white drop-shadow-2xl">
                فن <span className="text-gold">النار والتندور</span>
              </motion.h2>
              <motion.div variants={fadeUp} className="mb-8 w-full max-w-xs ml-auto">
                <OrnamentalDivider />
              </motion.div>
              <motion.p variants={fadeUp} className="text-beige/80 leading-relaxed mb-6 font-light text-lg md:text-xl">
                نروض النار لنستخرج أعمق النكهات. في مطابخنا، لا نكتفي بالطهي، بل نمارس طقوساً قديمة تتوارثها الأجيال.
              </motion.p>
              <motion.p variants={fadeUp} className="text-beige/80 leading-relaxed mb-10 font-light text-lg md:text-xl">
                حرارة التندور تعانق التوابل لتخلق سيمفونية من الروائح التي تسبق المذاق، لتقدم لك تجربة ملكية لا تُنسى.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spices & Ingredients Section (Story 2) */}
      <section id="story-spices" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-burgundy-dark/20"></div>
        <SpiceParticles />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-2 md:order-1"
            >
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-white drop-shadow-2xl">
                سر <span className="text-gold">التوابل الملكية</span>
              </motion.h2>
              <motion.div variants={fadeUp} className="mb-8 w-full max-w-xs ml-auto">
                <OrnamentalDivider />
              </motion.div>
              <motion.p variants={fadeUp} className="text-beige/80 leading-relaxed mb-6 font-light text-lg md:text-xl">
                من أسواق الهند العتيقة إلى قلب كارفين ماسالا، ننتقي أندر التوابل وأجودها. كل حبة توابل تحمل قصة حضارة عريقة.
              </motion.p>
              <motion.p variants={fadeUp} className="text-beige/80 leading-relaxed mb-10 font-light text-lg md:text-xl">
                ندمج بين طرق الطهي التقليدية واللمسات العصرية لنبتكر أطباقاً تتجاوز حدود المذاق لتلامس الحواس.
              </motion.p>
              <motion.button 
                onClick={() => setShowOrdering(true)}
                variants={fadeUp} 
                className="text-lg text-gold border-b border-gold pb-1 hover:text-white hover:border-white transition-colors"
              >
                اكتشف قصتنا
              </motion.button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative"
            >
              <GoldFrame className="h-[500px] md:h-[600px] rounded-t-full overflow-hidden border-0">
                <div className="w-full h-full rounded-t-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop" 
                    alt="Indian Spices" 
                    className="w-full h-full object-cover brightness-75 hover:brightness-100 hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
                </div>
              </GoldFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Luxury Menu Section */}
      <section id="menu" className="py-32 bg-burgundy-dark relative overflow-hidden">
        {/* Cinematic Background Layers */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop" 
            alt="Spices Texture" 
            className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          {/* Mughal Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%23c9a35c' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_transparent_100%)] opacity-40"></div>
        </div>
        
        <FireEffect />
        <SpiceParticles />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24">
            <motion.p 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-gold text-lg tracking-[0.4em] uppercase mb-4 font-serif"
            >
              الوليمة الملكية
            </motion.p>
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-6xl md:text-8xl font-serif text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              رحلة <span className="text-gold">التذوق</span>
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6">
              <OrnamentalDivider />
            </motion.div>
          </div>

          {/* 1. الشوربة والمقبلات */}
          <div className="mb-32">
            <motion.h3 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif text-gold text-center mb-16 flex items-center justify-center gap-8"
            >
              <span className="h-[1px] flex-1 bg-gradient-to-l from-gold/0 via-gold/40 to-gold/0"></span>
              الشوربة والمقبلات
              <span className="h-[1px] flex-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"></span>
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {[
                { name: "Mulligatawny Soup", desc: "شوربة العدس الهندية مع دجاج تندوري ونان", price: "١٦٥", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
                { name: "Indian Samosa", desc: "سمبوسة هندية محشوة بالبطاطس والبازلاء", price: "١٨٨", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop" },
                { name: "Chicken Lollipop", desc: "أجنحة دجاج متبلة ومقلية", price: "١٨٨", img: "https://images.unsplash.com/photo-1527324688102-d8a8b13d7745?q=80&w=400&auto=format&fit=crop" },
                { name: "Crispy Fried Shrimp", desc: "جمبري مقلي مقرمش", price: "٣١٥", img: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=400&auto=format&fit=crop" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.8, delay: i * 0.1 }} 
                  viewport={{ once: true }} 
                  className="group flex gap-6 items-center border-b border-white/5 pb-8 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-2xl font-serif text-white group-hover:text-gold transition-colors duration-500">{item.name}</h4>
                      <div className="text-gold font-serif text-xl">{item.price} ج.م</div>
                    </div>
                    <p className="text-beige/60 text-base font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. الأطباق الرئيسية */}
          <div className="mb-32">
            <motion.h3 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif text-gold text-center mb-16 flex items-center justify-center gap-8"
            >
              <span className="h-[1px] flex-1 bg-gradient-to-l from-gold/0 via-gold/40 to-gold/0"></span>
              الأطباق الرئيسية
              <span className="h-[1px] flex-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"></span>
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "Butter Chicken",
                  desc: "دجاج تندوري في صوص الزبدة والكريمة الغني بالتوابل الهندية.",
                  price: "٤٧٦ ج.م",
                  tag: "الأكثر شعبية",
                  img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop"
                },
                {
                  title: "Mutton Rogan Josh",
                  desc: "لحم ضأن مطهو ببطء في صوص كاري أحمر غني بالنكهات.",
                  price: "٥٤٥ ج.م",
                  tag: "توصية الشيف",
                  img: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?q=80&w=600&auto=format&fit=crop"
                },
                {
                  title: "Chicken Biryani",
                  desc: "أرز بسمتي معطر بالزعفران مع دجاج متبل بالبهارات الهندية الأصيلة.",
                  price: "٤٣٦ ج.م",
                  tag: "الأكثر شعبية",
                  img: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=600&auto=format&fit=crop"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <GoldFrame className="group cursor-pointer bg-ink/40 border-0 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 h-full flex flex-col">
                    <div className="p-8 text-center flex-grow flex flex-col items-center">
                      {item.tag && (
                        <div className="mb-4">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-ink bg-gold px-3 py-1 rounded-sm font-bold shadow-[0_0_15px_rgba(201,163,92,0.5)]">
                            {item.tag}
                          </span>
                        </div>
                      )}
                      <div className="bg-ink/80 backdrop-blur-md border border-gold/40 text-gold px-6 py-2 rounded-full text-xl font-serif shadow-[0_0_20px_rgba(201,163,92,0.2)] inline-block mb-6">
                        {item.price}
                      </div>
                      <h3 className="text-3xl font-serif mb-4 text-white group-hover:text-gold transition-colors duration-500">{item.title}</h3>
                      <p className="text-beige/70 font-light text-base leading-relaxed mb-6">{item.desc}</p>
                    </div>
                  </GoldFrame>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3. الركن الدولي والمشاوي */}
          <div className="mb-32">
            <motion.h3 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif text-gold text-center mb-16 flex items-center justify-center gap-8"
            >
              <span className="h-[1px] flex-1 bg-gradient-to-l from-gold/0 via-gold/40 to-gold/0"></span>
              الركن الدولي والمشاوي
              <span className="h-[1px] flex-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"></span>
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {[
                { name: "Mixed Grill Platter", desc: "تشكيلة مختارة من المشاوي الهندية الشهيرة", price: "٥٧٠", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop" },
                { name: "Grilled Salmon", desc: "فيليه سالمون مشوي مع خضروات موسمية", price: "٦٢٠", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop" },
                { name: "Beef Fillet", desc: "فيليه لحم بقري فاخر مطهو حسب اختيارك", price: "٦٥٠", img: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=400&auto=format&fit=crop" },
                { name: "Fettuccine Alfredo", desc: "مكرونة فوتشيني بصلصة الكريمة والبارميزان", price: "٢٦٠", img: "https://images.unsplash.com/photo-1645112481338-3518977af11c?q=80&w=400&auto=format&fit=crop" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.8, delay: i * 0.1 }} 
                  viewport={{ once: true }} 
                  className="group flex gap-6 items-center border-b border-white/5 pb-8 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-2xl font-serif text-white group-hover:text-gold transition-colors duration-500">{item.name}</h4>
                      <div className="text-gold font-serif text-xl">{item.price} ج.م</div>
                    </div>
                    <p className="text-beige/60 text-base font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-32 text-center">
            <motion.button 
              onClick={() => setShowOrdering(true)}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 40px rgba(201,163,92,0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group bg-gold text-ink px-16 py-5 rounded-full text-xl font-bold transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center gap-3">
                اكتشف المنيو الكامل <ShoppingBag size={22} />
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Atmosphere Section (The Palace) */}
      <section id="atmosphere" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_#0a0a0a_80%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-gold text-lg tracking-[0.3em] uppercase mb-4"
            >
              القصر الملكي
            </motion.p>
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl"
            >
              أجواء <span className="text-gold">تأسر الحواس</span>
            </motion.h2>
            <motion.p 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-beige/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
            >
              إضاءة دافئة، ديكورات مستوحاة من التراث الهندي بلمسة عصرية فاخرة، وموسيقى هادئة تكمل تجربتك الاستثنائية في كارفين ماسالا.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GoldFrame className="h-[400px] md:h-[600px] overflow-hidden border-0">
                <img src="https://i.postimg.cc/BZ18vkWm/603910843-1158338549792380-6615533859420913573-n-(1).jpg" alt="Restaurant Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </GoldFrame>
            </motion.div>
            <div className="grid grid-rows-2 gap-4 h-[400px] md:h-[600px]">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <GoldFrame className="h-full overflow-hidden border-0">
                  <img src="https://i.postimg.cc/sX5Rkp80/603909347-1158315169794718-5630284246935016690-n.jpg" alt="Warm Lighting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </GoldFrame>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <GoldFrame className="h-full overflow-hidden border-0">
                  <img src="https://i.postimg.cc/g25FrSbM/622824301-1185877940371774-3730018937596831752-n.jpg" alt="Luxury Details" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </GoldFrame>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Grid Section (Unified Brand Identity) */}
      <section className="py-24 md:py-32 bg-ink relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_transparent_100%)] opacity-20"></div>
        {/* Subtle background mandala/pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] border-[1px] border-gold rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(201,163,92,0.1)]">
            <div className="w-[600px] h-[600px] border-[1px] border-gold rounded-full flex items-center justify-center rotate-45">
              <div className="w-[400px] h-[400px] border-[1px] border-gold rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.p 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-gold text-lg tracking-[0.3em] uppercase mb-4"
            >
              عالم كارفين ماسالا
            </motion.p>
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-2xl"
            >
              تابعنا على <span className="text-gold">إنستغرام</span>
            </motion.h2>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="mb-8 w-full max-w-xs mx-auto"
            >
              <OrnamentalDivider />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post 1: Food Close-up */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60 transition-colors duration-500">
                <img src="https://i.postimg.cc/g25FrSbM/622824301-1185877940371774-3730018937596831752-n.jpg" alt="Indian Dish" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <span className="text-gold font-serif text-lg tracking-wider">اكتشف المزيد</span>
                </div>
              </GoldFrame>
            </motion.a>

            {/* Post 2: Branding / Quote */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
              className="group relative aspect-square bg-burgundy transition-colors duration-500"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60">
                <div className="w-full h-full border border-gold/20 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                  <h3 className="text-gold font-serif text-2xl md:text-3xl leading-relaxed relative z-10">
                    "الطهي هو فن،<br/>والتوابل هي ألواننا."
                  </h3>
                  <div className="w-8 h-[1px] bg-gold/50 mt-6 relative z-10"></div>
                </div>
              </GoldFrame>
            </motion.a>

            {/* Post 3: Dark Artistic Shot (Fire/Spices) */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60 transition-colors duration-500">
                <img src="https://i.postimg.cc/sX5Rkp80/603909347-1158315169794718-5630284246935016690-n.jpg" alt="Cooking Fire" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-ink/40 group-hover:bg-transparent transition-colors duration-500"></div>
              </GoldFrame>
            </motion.a>

            {/* Post 4: Dark Artistic Shot (Hands/Prep) */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60 transition-colors duration-500">
                <img src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" alt="Chef Hands" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <span className="text-gold font-serif text-lg tracking-wider">كواليس الإبداع</span>
                </div>
              </GoldFrame>
            </motion.a>

            {/* Post 5: Food Close-up */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60 transition-colors duration-500">
                <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop" alt="Samosa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </GoldFrame>
            </motion.a>

            {/* Post 6: Branding / Quote */}
            <motion.a 
              href="#"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }}
              className="group relative aspect-square bg-ink transition-colors duration-500"
            >
              <GoldFrame className="w-full h-full border-0 hover:border-gold/60">
                <div className="w-full h-full border border-gold/20 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
                  <h3 className="text-gold font-serif text-2xl md:text-3xl leading-relaxed relative z-10">
                    "تجربة ملكية<br/>في كل طبق."
                  </h3>
                  <div className="w-8 h-[1px] bg-gold/50 mt-6 relative z-10"></div>
                  <p className="text-beige/60 mt-4 text-sm font-light tracking-widest uppercase relative z-10">Karvin Massala</p>
                </div>
              </GoldFrame>
            </motion.a>
          </div>
          
          <div className="mt-16 text-center">
            <a href="#" className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors border-b border-gold/30 hover:border-white pb-1">
              <span className="font-serif text-lg tracking-widest">@KarvinMassala</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="location" className="py-24 md:py-32 bg-ink relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_transparent_100%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <motion.p variants={fadeUp} className="text-gold text-lg tracking-[0.3em] uppercase mb-4">
                تواصل معنا
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-2xl">
                نحن هنا <span className="text-gold">لخدمتك</span>
              </motion.h2>
              <motion.div variants={fadeUp} className="mb-10 w-full max-w-xs ml-auto">
                <OrnamentalDivider />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">الموقع</h4>
                    <p className="text-beige/70 text-sm leading-relaxed">مجمع ميفيدا - Business Park B2<br/>شارع التسعين الجنوبي - التجمع الخامس</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Clock className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">ساعات العمل</h4>
                    <p className="text-beige/70 text-sm leading-relaxed">يومياً من 11 صباحاً<br/>حتى 12 منتصف الليل</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Phone className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">رقم الهاتف</h4>
                    <p className="text-beige/70 text-sm" dir="ltr">01203243503</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <a href="https://wa.me/201203243503" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/50 rounded-full px-6 py-3 transition-all duration-300 w-full h-12">
                    <MessageCircle className="text-gold group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-white text-sm font-medium">تحدث معنا الآن</span>
                  </a>
                </motion.div>
              </div>

              <motion.form variants={fadeUp} className="space-y-4 bg-white/[0.02] p-6 md:p-8 rounded-2xl border border-white/5">
                <h4 className="text-white font-medium mb-4 text-lg">أرسل لنا رسالة</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="الاسم" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-beige/40 focus:outline-none focus:border-gold/50 transition-colors" />
                  <input type="tel" placeholder="رقم الهاتف" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-beige/40 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                <textarea placeholder="رسالتك" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-beige/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"></textarea>
                <button type="button" className="w-full bg-gold text-ink font-medium py-3 rounded-lg hover:bg-white transition-colors">
                  إرسال الرسالة
                </button>
              </motion.form>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative h-[400px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden border border-gold/20 shadow-[0_10px_40px_rgba(201,163,92,0.05)]"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60389552702!2d31.4330521!3d30.0596185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458180068019d0b%3A0x6b7715b9d316e1e2!2sNew%20Cairo%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1711860000000!5m2!1sen!2seg" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%) contrast(100%)', position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574966739987-65e38f2cea46?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Dining Table" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-ink/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif mb-6 text-white"
          >
            احجز <span className="text-gold">تجربتك الآن</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-beige/80 mb-10 font-light text-xl leading-relaxed"
          >
            انضم إلينا في أمسية لا تُنسى حيث تلتقي الفخامة بالمذاق الأصيل.
          </motion.p>
          <motion.button 
            onClick={() => setShowReservation(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-burgundy hover:bg-burgundy-dark text-white border border-burgundy hover:border-gold px-12 py-4 rounded-full text-lg transition-all duration-300 shadow-[0_0_30px_rgba(59,13,13,0.5)] hover:shadow-[0_0_40px_rgba(201,163,92,0.3)]"
          >
            تأكيد الحجز
          </motion.button>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="bg-[#4A0404] py-24 relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%23C7A000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-[#C7A000] text-center mb-8"
          >
            JOIN OUR 10K+ FOLLOWERS
          </motion.h2>
          <div className="mb-12">
            <OrnamentalDivider />
          </div>
          
          <div 
            id="instagram-feed-container"
            className="w-full border-double border-4 border-[#C7A000] p-4 min-h-[300px] flex items-center justify-center text-[#C7A000] font-serif text-xl"
          >
            [LIVE INSTAGRAM FEED LOADING...]
          </div>
          
          <div className="text-center mt-16">
            <a 
              href="https://www.instagram.com/karvinmassala/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C7A000] text-[#4A0404] hover:bg-[#4A0404] hover:text-[#C7A000] border border-[#C7A000] px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
            >
              <Instagram size={20} />
              FOLLOW @KARVINMASSALA ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://i.postimg.cc/kGFwP47g/599946786-1155252650100970-534780702069780137-n-removebg-preview.png" 
                  alt="Karvin Massala Logo" 
                  className="h-16 md:h-20 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="text-3xl font-serif text-gold">
                  Karvin Massala
                </div>
              </div>
              <p className="text-beige/60 font-light max-w-sm text-base leading-relaxed">
                ملاذ عصري لفن الطهي الهندي، حيث تلتقي الوصفات القديمة بالفخامة المعاصرة.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-medium mb-6">تواصل معنا</h4>
              <ul className="space-y-4 text-beige/70 font-light text-base">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-gold shrink-0 mt-1" />
                  <span>مجمع ميفيدا - Business Park B2، <br/>التجمع الخامس، القاهرة</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-gold shrink-0" />
                  <span dir="ltr">01203243503</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-6">ساعات العمل</h4>
              <ul className="space-y-4 text-beige/70 font-light text-base">
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-gold shrink-0 mt-1" />
                  <div>
                    <p className="text-white mb-1">يومياً</p>
                    <p>من 11 صباحاً حتى 12 منتصف الليل</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-beige/50 font-light">
            <p>&copy; {new Date().getFullYear()} مطعم كارفين ماسالا. جميع الحقوق محفوظة.</p>
            <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
              <a href="#" className="hover:text-gold transition-colors">إنستغرام</a>
              <a href="#" className="hover:text-gold transition-colors">تويتر</a>
              <a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/201203243503"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="fixed bottom-6 right-6 z-50 bg-[#1b3b28] border border-[#2a5c3e] text-beige p-4 rounded-full shadow-[0_0_30px_rgba(201,163,92,0.3)] hover:bg-[#224a32] hover:scale-110 hover:shadow-[0_0_40px_rgba(201,163,92,0.6)] transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="relative z-10" />
        {/* Subtle pulse effect */}
        <span className="absolute inset-0 rounded-full bg-gold opacity-10 group-hover:opacity-20 group-hover:animate-ping"></span>
      </motion.a>

      {/* Ordering System Overlay */}
      <AnimatePresence>
        {showOrdering && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] overflow-y-auto"
          >
            <OrderingSystem onClose={() => setShowOrdering(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation System Overlay */}
      <AnimatePresence>
        {showReservation && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] overflow-y-auto"
          >
            <ReservationSystem onClose={() => setShowReservation(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
