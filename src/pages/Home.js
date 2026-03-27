import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, MapPin, Star, Users, CalendarDays, ChefHat, Sparkles, Clock, Quote } from 'lucide-react';
import api from '../api';

// Restaurant images for hero slideshow
//import imgMonterial from '../assets/restaurant-images/monterial.webp';
import imgMonterial1 from '../assets/restaurant-images/monterial1.webp';
import imgMonterial2 from '../assets/restaurant-images/monterial2.webp';
import imgRangde from '../assets/restaurant-images/rangde.webp';
import imgRestobar from '../assets/restaurant-images/re3stobar.webp';
import imgStittsville1 from '../assets/restaurant-images/stittsville1.webp';
import imgStittsville2 from '../assets/restaurant-images/stittsville2.webp';
import imgStittsville3 from '../assets/restaurant-images/stittsville3.webp';
import imgWellington from '../assets/restaurant-images/wellington.webp';
import uberEatsLogo from '../assets/ubereats.png';
import doordashLogo from '../assets/doordash.png';

const heroImages = [
  imgWellington, imgStittsville1, imgRangde, imgRestobar,
  imgMonterial1, imgStittsville2, imgMonterial2, imgStittsville3,
];

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {heroImages.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading={i < 2 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      {/* Progress dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-400 w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

const stats = [
  { icon: MapPin, value: '6', label: 'Locations' },
  { icon: ChefHat, value: '200+', label: 'Menu Items' },
  { icon: Users, value: '50K+', label: 'Reviews (Most reviewed restaurant chain in Canada)' },
  { icon: Star, value: '4.8', label: 'Avg Rating' },
];

function normalizeCountry(country = '') {
  const value = String(country).trim().toLowerCase();
  if (value.includes('canada')) return 'Canada';
  if (value === 'usa' || value === 'us' || value.includes('united states')) return 'USA';
  return country || 'Other';
}

function getFeaturedDishImage(item) {
  if (!item) return null;

  const fromImagesArray = Array.isArray(item.images)
    ? (item.images[0]?.source || item.images[0]?.url || item.images[0]?.imageUrl || item.images[0]?.image_url)
    : null;

  const source = item.image_url || item.imageUrl || fromImagesArray || null;
  if (!source) return null;

  if (typeof source === 'string' && source.startsWith('//')) return `https:${source}`;
  return source;
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const groupedLocations = restaurants.reduce((groups, restaurant) => {
    const country = normalizeCountry(restaurant.country);
    if (!groups[country]) groups[country] = [];
    groups[country].push(restaurant);
    return groups;
  }, {});

  useEffect(() => {
    const loadHomepageContent = async () => {
      const [featuredResult, testimonialResult, restaurantsResult] = await Promise.allSettled([
        api.getFeaturedDishes(),
        api.getTestimonials(),
        api.getRestaurants(),
      ]);

      if (featuredResult.status === 'fulfilled') {
        setFeaturedItems((featuredResult.value || []).slice(0, 6));
      } else {
        console.error(featuredResult.reason);
      }

      if (testimonialResult.status === 'fulfilled') {
        setTestimonials((testimonialResult.value || []).slice(0, 6));
      } else {
        console.error(testimonialResult.reason);
      }

      if (restaurantsResult.status === 'fulfilled') {
        setRestaurants(restaurantsResult.value || []);
      } else {
        console.error(restaurantsResult.reason);
      }
    };

    loadHomepageContent();
    const interval = setInterval(loadHomepageContent, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Indian ornamental overlays */}
      <div className="indian-mandala-tl" />
      <div className="indian-mandala-br" />

      {/* ===== HERO ===== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0">
          <HeroSlideshow />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-dark-950/70" />
          {/* Subtle warm glow accents */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full grand-opening-badge text-sm">
              <MapPin size={16} />
              <span>Ottawa, Ontario · Stittsville & Wellington</span>
              <Sparkles size={14} className="animate-sparkle" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Masakali</span>
            <br />
            <span className="text-gold-gradient">Indian Cuisine</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Proudly serving Ottawa with two branches in <span className="text-amber-400 font-semibold">Stittsville</span> and <span className="text-amber-400 font-semibold">Wellington</span> —
            bringing authentic Indian flavors to your neighborhood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/reservations" className="btn-gold text-lg !px-10 !py-4">
              Reserve a Table <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/menu" className="btn-outline-gold text-lg !px-10 !py-4">
              Explore Menu
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-4"
          >
            {/* <Link to="/manage-reservations" className="btn-outline-gold !px-8 !py-3">
              <Clock size={18} className="mr-2" /> Manage Reservations
            </Link> */}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-neutral-500 dark:border-neutral-700 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-amber-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 px-6 py-6 md:px-10 md:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Delivery Partners</p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                    We are available on Uber Eats and DoorDash
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 flex items-center gap-3">
                    <img src={uberEatsLogo} alt="Uber Eats" className="h-10 w-auto object-contain" loading="lazy" />
                    <span className="text-neutral-700 dark:text-neutral-200 font-medium">Uber Eats</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 flex items-center gap-3">
                    <img src={doordashLogo} alt="DoorDash" className="h-10 w-auto object-contain" loading="lazy" />
                    <span className="text-neutral-700 dark:text-neutral-200 font-medium">DoorDash</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-neutral-200 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-950/50 bg-indian-jali relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <AnimatedSection key={stat.label} delay={i * 0.1} className="text-center">
                  <Icon size={24} className="text-amber-500 dark:text-amber-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white font-display">{stat.value}</div>
                  <div className="text-neutral-500 text-sm mt-1">{stat.label}</div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== OTTAWA BRANCH HIGHLIGHT ===== */}
      <section className="py-20 md:py-28 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <MapPin size={16} className="text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">Serving Ottawa Daily</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
              Visit Our Ottawa Branches
            </h2>
            <p className="text-neutral-500 text-lg">
              <MapPin size={16} className="inline mr-1 text-amber-500" />
              Stittsville Main Branch & Wellington
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mb-12">
            <div className="bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 grand-opening-card">
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-neutral-900 dark:text-white font-display text-2xl font-bold mb-2">Stittsville Main Branch</h3>
                    <p className="text-neutral-500">5507 Hazeldean Rd Unit C3-1, Stittsville, ON</p>
                    <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">Open daily: 11:30 AM - 10:00 PM</p>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-neutral-900 dark:text-white font-display text-2xl font-bold mb-2">Wellington Branch</h3>
                    <p className="text-neutral-500">1111 Wellington St. W, Ottawa, ON</p>
                    <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">Open daily: 11:30 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4} className="text-center">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
              Masakali Indian Cuisine proudly serves Ottawa with two convenient branches.
              Reserve your table at Stittsville or Wellington today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reservations" className="btn-gold text-lg !px-10 !py-4">
                Reserve at Ottawa Branches
              </Link>
              <Link to="/locations" className="btn-outline-gold text-lg !px-10 !py-4">
                View Branch Details
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== LOGO CAROUSEL ===== */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d97706 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <AnimatedSection className="text-center mb-10">
          <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Our Brands</span>
          <div className="section-divider" />
        </AnimatedSection>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

          <div className="logo-carousel-track">
            {[...Array(8)].map((_, setIdx) => (
              <React.Fragment key={setIdx}>
                <div className="flex-shrink-0 mx-10 md:mx-16 flex items-center justify-center" style={{ minWidth: '200px' }}>
                  <img src="/logo/Masakali-Indian-Cuisine.png" alt="Masakali Indian Cuisine" className="h-24 md:h-28 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 mx-10 md:mx-16 flex items-center justify-center" style={{ minWidth: '200px' }}>
                  <img src="/logo/Masakali-RestoBar.png" alt="Masakali Restobar" className="h-20 md:h-24 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 mx-10 md:mx-16 flex items-center justify-center" style={{ minWidth: '200px' }}>
                  <img src="/logo/RangDe-Indian-Cuisine.png" alt="RangDe Indian Cuisine" className="h-36 md:h-34 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <style>{`
          .logo-carousel-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: logoScroll 30s linear infinite;
          }
          // .logo-carousel-track:hover {
          //   animation-play-state: paused;
          // }
          @keyframes logoScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== BRAND STORY ===== */}
      {/* <section className="py-24 bg-pattern bg-indian-paisley relative overflow-hidden bg-indian-arch">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Our Story</span>
              <div className="section-divider !mx-0 !ml-0" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-4 mb-6">
                A Journey of <span className="text-gold-gradient">Flavor & Passion</span>
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Founded in 2021, Masakali Indian Cuisine began with a simple dream — to bring authentic
                Indian flavors to every table. What started as a single restaurant in Ottawa has grown
                into a thriving restaurant group spanning multiple cities.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                Each Masakali location is a celebration of India's diverse culinary heritage, from the
                tandoori traditions of the North to the spice-rich curries of the South. Our chefs craft
                every dish with authenticity, creativity, and love.
              </p>
              <Link to="/about" className="btn-outline-gold">
                Read Our Story <ArrowRight size={16} className="ml-2" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl" />
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-6 shadow-sm dark:shadow-none">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-500 dark:text-amber-400 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="text-neutral-900 dark:text-white font-semibold mb-1">Authentic Recipes</h3>
                      <p className="text-neutral-500 text-sm">Traditional recipes passed down through generations, perfected by our master chefs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-500 dark:text-amber-400 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="text-neutral-900 dark:text-white font-semibold mb-1">Fresh Ingredients</h3>
                      <p className="text-neutral-500 text-sm">Sourced from trusted local and international suppliers for unmatched freshness.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-500 dark:text-amber-400 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-neutral-900 dark:text-white font-semibold mb-1">Global Vision</h3>
                      <p className="text-neutral-500 text-sm">Expanding across North America to bring Indian cuisine to every community.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section> */}

      {/* ===== FEATURED DISHES ===== */}
      {/* check Home.js.bak for code */}

      {/* ===== LOCATIONS PREVIEW ===== */}
      <section className="py-24 bg-pattern bg-section-indian relative overflow-hidden">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Find Us</span>
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-4">
              Our <span className="text-gold-gradient">Locations</span>
            </h2>
          </AnimatedSection>

          {['Canada', 'USA'].map((country, countryIndex) => {
            const countryLocations = groupedLocations[country] || [];
            if (!countryLocations.length) return null;

            return (
              <AnimatedSection key={country} delay={countryIndex * 0.1} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{country}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {countryLocations.length} Location{countryLocations.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countryLocations.map((restaurant, i) => (
                    <AnimatedSection key={restaurant.id || `${country}-${restaurant.slug || i}`} delay={i * 0.08}>
                      <div className="bg-white/80 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 card-hover shadow-sm dark:shadow-none h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin size={20} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-neutral-900 dark:text-white font-semibold">{restaurant.brand || restaurant.name}</h4>
                            {restaurant.brand && restaurant.name && (
                              <p className="text-neutral-500 text-xs">{restaurant.name}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-neutral-500 text-sm">
                          {restaurant.address}, {restaurant.city}, {restaurant.province_state}, {restaurant.country}
                        </p>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            );
          })}

          <AnimatedSection className="text-center mt-12">
            <Link to="/locations" className="btn-outline-gold">
              View All Locations <ArrowRight size={16} className="ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== QUICK RESERVATION ===== */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden bg-indian-jali">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center">
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Reserve Now</span>
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-4 mb-6">
              Book Your <span className="text-gold-gradient">Experience</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
              Reserve your table at any of our locations. Whether it's a romantic dinner,
              family celebration, or business meeting — we have the perfect setting for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reservations" className="btn-gold text-lg !px-10 !py-4">
                <CalendarDays size={20} className="mr-2" /> Reserve a Table
              </Link>
              {/* <Link to="/manage-reservations" className="btn-outline-gold text-lg !px-10 !py-4">
                <Clock size={20} className="mr-2" /> Manage Reservations
              </Link> */}
              <Link to="/catering" className="btn-outline-gold text-lg !px-10 !py-4">
                <Users size={20} className="mr-2" /> Catering Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-24 bg-pattern bg-indian-paisley relative overflow-hidden bg-indian-arch">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-4">
              What Our <span className="text-gold-gradient">Guests Say</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, i) => (
              <AnimatedSection key={review.id || `${review.name}-${i}`} delay={i * 0.15}>
                <div className="bg-white/80 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 card-hover relative shadow-sm dark:shadow-none">
                  <Quote size={40} className="text-amber-500/10 absolute top-6 right-6" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(Math.max(1, Math.min(5, Number(review.rating) || 5)))].map((_, j) => (
                      <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <span className="text-amber-500 dark:text-amber-400 font-bold text-sm">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-neutral-900 dark:text-white text-sm font-medium">{review.name}</p>
                      <p className="text-neutral-500 text-xs">{review.branch} branch</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATERING CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-amber-100/50 dark:from-amber-900/20 via-neutral-50 dark:via-neutral-950 to-amber-100/50 dark:to-amber-900/20 border-y border-amber-500/10 bg-indian-lotus relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Planning an Event?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8">
              Let Masakali cater your next event with authentic Indian cuisine.
              From intimate gatherings to grand celebrations.
            </p>
            <Link to="/catering" className="btn-gold text-lg">
              Explore Catering <ArrowRight size={18} className="ml-2" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
