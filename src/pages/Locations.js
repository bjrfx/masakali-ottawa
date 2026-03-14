import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Clock, ExternalLink, Navigation } from 'lucide-react';
import api from '../api';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const locationImages = {
  wellington: 'from-amber-900/30 to-red-900/20',
  stittsville: 'from-emerald-900/30 to-amber-900/20',
  montreal: 'from-blue-900/30 to-purple-900/20',
  rangde: 'from-orange-900/30 to-pink-900/20',
  restobar: 'from-violet-900/30 to-amber-900/20',
};

const locationDetails = {
  wellington: { hours: 'Mon-Sun: 11:30 AM - 10:00 PM', maps: 'https://maps.google.com/?q=1111+Wellington+St+W+Ottawa+ON+K1Y+1P1' },
  stittsville: { hours: 'Mon-Sun: 11:30 AM - 10:00 PM', maps: 'https://maps.google.com/?q=5507+Hazeldean+Rd+Unit+C3-1+Stittsville+ON+K2S+0P5', badge: 'Main Branch' },
  montreal: { hours: 'Mon-Sun: 12:00 PM - 10:00 PM', maps: 'https://maps.google.com/?q=1015+Sherbrooke+St+W+Montreal+Quebec+H3A+1G5', badge: 'New' },
  rangde: { hours: 'Mon-Sun: 11:30 AM - 10:00 PM', maps: 'https://maps.google.com/?q=700+March+Rd+Unit+H+Kanata+ON+K2K+2V9' },
  restobar: { hours: 'Mon-Thu: 4:00 PM - 12:00 AM, Fri-Sun: 12:00 PM - 2:00 AM', maps: 'https://maps.google.com/?q=97+Clarence+St+Ottawa+ON+K1N+5P9' },
};

export default function Locations() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRestaurants().then(data => {
      setRestaurants(data);
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen pt-20 relative">
      <div className="indian-mandala-tl" />
      <div className="indian-mandala-br" />

      {/* Hero */}
      <section className="py-20 bg-pattern bg-indian-paisley relative overflow-hidden bg-indian-arch">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Our Locations</span>
            <div className="section-divider !mx-0" />
            <h1 className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mt-4 mb-4">
              Find a <span className="text-gold-gradient">Masakali</span> Near You
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl">
              Discover our Ottawa locations in Stittsville and Wellington,
              where authentic Indian cuisine meets warm hospitality.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-950 bg-section-indian relative overflow-hidden">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                  <div className="skeleton h-40 mb-6 rounded-xl" />
                  <div className="skeleton h-6 w-3/4 mb-3" />
                  <div className="skeleton h-4 w-1/2 mb-6" />
                  <div className="skeleton h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <>
            {/* Featured Ottawa Branches Banner */}
            <AnimatedSection className="mb-10">
              <div className="grand-opening-card bg-gradient-to-br from-amber-50 dark:from-amber-900/10 via-white dark:via-neutral-900/80 to-amber-50 dark:to-amber-900/10 rounded-2xl p-8 md:p-12">
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    <div className="flex-shrink-0 w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center">
                      <MapPin size={44} className="text-amber-500" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full grand-opening-badge text-xs mb-4">
                        Ottawa Branches
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                        Stittsville Main Branch & Wellington
                      </h2>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold text-lg mb-2">Masakali Indian Cuisine</p>
                      <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">
                        This Ottawa website serves our two local branches so guests can quickly
                        find hours, directions, and reservation options.
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-3">
                      <Link to="/reservations" className="btn-gold !px-10 !py-3.5 text-center">
                        Reserve a Table
                      </Link>
                      <Link to="/menu" className="btn-outline-gold !px-10 !py-3.5 text-center">
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants
                .sort((a, b) => {
                  if (a.slug === 'stittsville') return -1;
                  if (b.slug === 'stittsville') return 1;
                  return 0;
                })
                .map((restaurant, i) => {
                const details = locationDetails[restaurant.slug] || {};
                const gradient = locationImages[restaurant.slug] || 'from-amber-900/20 to-neutral-900';
                return (
                  <AnimatedSection key={restaurant.id} delay={i * 0.1}>
                    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden card-hover gold-glow-hover h-full flex flex-col shadow-sm dark:shadow-none">
                      <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                        <MapPin size={48} className="text-white/10 group-hover:text-white/20 transition-colors" />
                        {details.badge && (
                          <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                            details.badge === 'Main Branch' ? 'bg-amber-500 text-black' :
                            details.badge === 'New' ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {details.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-neutral-900 dark:text-white font-semibold text-xl mb-1">{restaurant.name || restaurant.brand}</h3>
                        <p className="text-amber-500 dark:text-amber-400/80 text-sm font-medium mb-4">{restaurant.brand}</p>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-500 dark:text-neutral-400 text-sm">{restaurant.address}, {restaurant.city}, {restaurant.province_state}, {restaurant.country}</span>
                          </div>
                          {restaurant.phone && (
                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                              <a href={`tel:${restaurant.phone}`} className="text-neutral-500 dark:text-neutral-400 text-sm hover:text-amber-500 dark:hover:text-amber-400 transition-colors">{restaurant.phone}</a>
                            </div>
                          )}
                          {restaurant.email && (
                            <div className="flex items-center gap-3">
                              <Mail size={16} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                              <a href={`mailto:${restaurant.email}`} className="text-neutral-500 dark:text-neutral-400 text-sm hover:text-amber-500 dark:hover:text-amber-400 transition-colors">{restaurant.email}</a>
                            </div>
                          )}
                          {details.hours && (
                            <div className="flex items-start gap-3">
                              <Clock size={16} className="text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                              <span className="text-neutral-500 dark:text-neutral-400 text-sm">{details.hours}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Link to="/reservations" className="flex-1 text-center px-4 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-all">
                            Reserve
                          </Link>
                          <Link to="/menu" className="flex-1 text-center px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                            View Menu
                          </Link>
                          {details.maps && (
                            <a href={details.maps} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all" title="Open in Google Maps">
                              <Navigation size={16} />
                            </a>
                          )}
                        </div>

                        {restaurant.website && (
                          <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 text-neutral-400 dark:text-neutral-500 text-xs hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                            <Globe size={12} /> {restaurant.website.replace('https://', '')}
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
            </>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950 bg-indian-lotus relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">
              All <span className="text-gold-gradient">Locations</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl h-96 flex items-center justify-center shadow-sm dark:shadow-none">
              <div className="text-center">
                <MapPin size={48} className="text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg mb-2">Interactive Map</p>
                <p className="text-neutral-400 dark:text-neutral-600 text-sm">Google Maps integration will show all locations</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
