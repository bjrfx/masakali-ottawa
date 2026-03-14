import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Filter, ChefHat, Flame, Leaf } from 'lucide-react';
import api from '../api';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const spiceColors = {
  mild: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', label: 'Mild' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', label: 'Medium' },
  hot: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', label: 'Hot' },
  extra_hot: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'Extra Hot' },
};

function getItemImageUrl(item) {
  const firstImage = Array.isArray(item.images) ? item.images[0]?.source : null;
  return firstImage || item.image_url || null;
}

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    Promise.all([api.getCategories(), api.getMenu()])
      .then(([cats, items]) => {
        setCategories(cats);
        setMenuItems(items);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredItems = menuItems.filter(item => {
    if (activeCategory && item.category_id !== activeCategory) return false;
    if (vegOnly && !item.is_vegetarian) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groupedItems = categories
    .filter(cat => !activeCategory || cat.id === activeCategory)
    .map(cat => ({
      ...cat,
      items: filteredItems.filter(item => item.category_id === cat.id),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Indian ornamental overlays */}
      <div className="indian-mandala-tl" />
      <div className="indian-mandala-br" />

      {/* Hero */}
      <section className="py-20 bg-pattern bg-indian-paisley relative overflow-hidden bg-indian-arch">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Our Menu</span>
            <div className="section-divider !mx-0" />
            <h1 className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mt-4 mb-4">
              Explore Our <span className="text-gold-gradient">Flavors</span>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl">
              Discover our carefully curated menu featuring authentic Indian dishes,
              from classic curries to innovative creations.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark !pl-10"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Veg filter */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${vegOnly ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}
              >
                <Leaf size={16} /> Vegetarian
              </button>

              {/* Category pills - scrollable on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${!activeCategory ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-950 bg-indian-jali relative overflow-hidden">
        <div className="indian-vine-left" />
        <div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                  <div className="skeleton h-40 mb-4 rounded-xl" />
                  <div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-full mb-4" />
                  <div className="skeleton h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : groupedItems.length === 0 ? (
            <div className="text-center py-20">
              <ChefHat size={48} className="text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">No dishes found matching your filters.</p>
            </div>
          ) : (
            groupedItems.map((category) => (
              <div key={category.id} className="mb-16">
                <AnimatedSection>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                    <span className="text-neutral-400 dark:text-neutral-600 text-sm">{category.items.length} items</span>
                  </div>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, i) => {
                    const spice = spiceColors[item.spice_level] || spiceColors.medium;
                    const imageUrl = getItemImageUrl(item);
                    const hasImage = Boolean(imageUrl) && !brokenImages[item.id];
                    return (
                      <AnimatedSection key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                        <div className="group bg-white/80 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden card-hover gold-glow-hover shadow-sm dark:shadow-none">
                          {/* Image placeholder */}
                          <div className="h-44 bg-gradient-to-br from-amber-100 dark:from-amber-900/20 to-neutral-100 dark:to-neutral-900 flex items-center justify-center relative">
                            {hasImage ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={() => setBrokenImages(prev => ({ ...prev, [item.id]: true }))}
                              />
                            ) : (
                              <ChefHat size={40} className="text-amber-500/20 group-hover:text-amber-400/40 transition-colors" />
                            )}
                            {item.is_featured && (
                              <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                                ★ Featured
                              </span>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-neutral-900 dark:text-white font-semibold text-lg leading-tight flex-1 mr-3">{item.name}</h3>
                              {/* <span className="text-amber-500 dark:text-amber-400 font-bold text-lg whitespace-nowrap">${item.price?.toFixed(2)}</span> */}
                            </div>
                            <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.is_vegetarian && (
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                                  <Leaf size={12} /> Veg
                                </span>
                              )}
                              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 ${spice.bg} ${spice.text} rounded-full`}>
                                <Flame size={12} /> {spice.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AnimatedSection>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
