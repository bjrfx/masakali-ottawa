import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, ChefHat, Flame, SlidersHorizontal, ChevronUp, ChevronDown, Leaf, LayoutGrid, List } from 'lucide-react';
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
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('stittsville');
  const [search, setSearch] = useState('');
  const [spiceFilter, setSpiceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('compact');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    api.getRestaurants()
      .then((data) => setRestaurants(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCategories({ branch: selectedLocation }),
      api.getMenu({ branch: selectedLocation }),
    ])
      .then(([cats, items]) => {
        setCategories(cats || []);
        setMenuItems(items || []);
      })
      .catch((err) => {
        console.error(err);
        setCategories([]);
        setMenuItems([]);
      })
      .finally(() => setLoading(false));
  }, [selectedLocation]);

  useEffect(() => {
    setActiveCategory('all');
    setSearch('');
    setSpiceFilter('all');
    setViewMode('compact');
    setFiltersExpanded(false);
    setBrokenImages({});
  }, [selectedLocation]);

  const locationOptions = [
    { slug: 'stittsville', label: 'Stittsville' },
    { slug: 'wellington', label: 'Wellington' },
  ];

  const availableLocations = locationOptions.filter((option) => (
    restaurants.some((restaurant) => String(restaurant?.slug || '').toLowerCase() === option.slug)
  ));

  const visibleLocations = availableLocations.length ? availableLocations : locationOptions;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== 'all' && String(item.category_id) !== String(activeCategory)) return false;
    if (spiceFilter !== 'all' && String(item.spice_level || 'medium') !== spiceFilter) return false;
    if (
      normalizedSearch
      && !String(item.name || '').toLowerCase().includes(normalizedSearch)
      && !String(item.description || '').toLowerCase().includes(normalizedSearch)
    ) return false;
    return true;
  });

  const categoryCounts = categories.reduce((acc, category) => {
    acc[String(category.id)] = filteredItems.filter((item) => String(item.category_id) === String(category.id)).length;
    return acc;
  }, {});

  const groupedItems = categories
    .filter((cat) => activeCategory === 'all' || String(cat.id) === String(activeCategory))
    .map((cat) => ({
      ...cat,
      items: filteredItems.filter((item) => String(item.category_id) === String(cat.id)),
    }))
    .filter((cat) => cat.items.length > 0);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setSpiceFilter('all');
  };

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Indian ornamental overlays */}
      <div className="indian-mandala-tl" />
      <div className="indian-mandala-br" />

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                Menu Filters
              </p>
              <button
                onClick={() => setFiltersExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-xs md:text-sm"
                aria-expanded={filtersExpanded}
                aria-label={filtersExpanded ? 'Collapse menu filters' : 'Expand menu filters'}
              >
                {filtersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {filtersExpanded ? 'Close' : 'Open'}
              </button>
            </div>

            {filtersExpanded && (
              <>
                <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
                  {visibleLocations.map((location) => {
                    const isActive = selectedLocation === location.slug;
                    return (
                      <button
                        key={location.slug}
                        onClick={() => setSelectedLocation(location.slug)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${isActive
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-[0_0_0_1px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-500/30'
                          }`}
                      >
                        {location.label} Menu
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(230px,1fr)_auto_auto] md:items-center">
                  <div className="relative w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                      type="text"
                      placeholder={`Search ${selectedLocation} dishes...`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input-dark !pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60">
                    <SlidersHorizontal size={15} className="text-neutral-400 dark:text-neutral-500" />
                    <select
                      value={spiceFilter}
                      onChange={(e) => setSpiceFilter(e.target.value)}
                      className="bg-transparent text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none"
                    >
                      <option value="all">All Spice</option>
                      <option value="mild">Mild</option>
                      <option value="medium">Medium</option>
                      <option value="hot">Hot</option>
                      <option value="extra_hot">Extra Hot</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('compact')}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${viewMode === 'compact'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      aria-pressed={viewMode === 'compact'}
                    >
                      <LayoutGrid size={15} /> Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('card')}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${viewMode === 'card'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      aria-pressed={viewMode === 'card'}
                    >
                      <LayoutGrid size={15} /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${viewMode === 'list'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      aria-pressed={viewMode === 'list'}
                    >
                      <List size={15} /> List
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 pr-2 snap-x snap-mandatory scrollbar-hide">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`snap-start whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${activeCategory === 'all'
                        ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-500/40'
                        }`}
                    >
                      All ({filteredItems.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(String(cat.id))}
                        className={`snap-start whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${String(activeCategory) === String(cat.id)
                          ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-500/40'
                          }`}
                      >
                        {cat.name} ({categoryCounts[String(cat.id)] || 0})
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
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
              <p className="text-neutral-500 text-lg">No dishes found for this location and filters.</p>
              <button onClick={clearFilters} className="mt-4 btn-outline-gold">
                Clear Filters
              </button>
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

                {viewMode === 'compact' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {category.items.map((item, i) => {
                      const spice = spiceColors[item.spice_level] || spiceColors.medium;
                      return (
                        <AnimatedSection key={item.id} delay={Math.min(i * 0.03, 0.2)}>
                          <div className="bg-white/85 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm dark:shadow-none">
                            <h3 className="text-neutral-900 dark:text-white font-semibold text-lg leading-tight line-clamp-1 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2 mb-3">
                              {item.description || 'No description available.'}
                            </p>
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
                        </AnimatedSection>
                      );
                    })}
                  </div>
                ) : viewMode === 'card' ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item, i) => {
                      const spice = spiceColors[item.spice_level] || spiceColors.medium;
                      const imageUrl = getItemImageUrl(item);
                      const hasImage = Boolean(imageUrl) && !brokenImages[item.id];
                      return (
                        <AnimatedSection key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                          <div className="group bg-white/80 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden card-hover gold-glow-hover shadow-sm dark:shadow-none">
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
                ) : (
                  <AnimatedSection>
                    <div className="bg-white/85 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                      {category.items.map((item, i) => {
                        const imageUrl = getItemImageUrl(item);
                        const hasImage = Boolean(imageUrl) && !brokenImages[item.id];
                        const isLastItem = i === category.items.length - 1;
                        return (
                          <div
                            key={item.id}
                            className={`p-4 md:p-6 ${isLastItem ? '' : 'border-b border-neutral-200 dark:border-neutral-800'}`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                              <div className="w-full sm:w-44 h-28 rounded-md overflow-hidden bg-gradient-to-br from-amber-100 dark:from-amber-900/20 to-neutral-100 dark:to-neutral-900 flex items-center justify-center shrink-0">
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
                                  <ChefHat size={30} className="text-amber-500/25" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-3">
                                  <h3 className="text-neutral-900 dark:text-white font-semibold text-2xl leading-tight">{item.name}</h3>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                                  {item.description || 'No description available.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AnimatedSection>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
