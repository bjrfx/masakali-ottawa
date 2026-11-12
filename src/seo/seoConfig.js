import { dishRecommendationGroups, flattenRecommendedDishes } from './recommendedDishes';

const envSiteUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SITE_URL)
  ? process.env.REACT_APP_SITE_URL.replace(/\/$/, '')
  : null;

export const siteSeo = {
  siteName: "Masakali Indian Cuisine",
  siteUrl: envSiteUrl || "https://masakaliottawa.ca",
  brandShort: "Masakali",
  brandName: "Masakali Indian Cuisine",
  groupName: "Masakali Group",
  defaultTitle: "Masakali Indian Cuisine | Indian Restaurant in Ottawa (Stittsville & Wellington)",
  defaultDescription: "Authentic Indian dining at Masakali in Ottawa. Visit our Stittsville and Wellington locations for classic curries, biryani, catering, and table reservations.",
  locale: "en_CA",
  ogLocale: "en_CA",
  htmlLang: 'en',
  cuisine: "Indian",
  priceRange: "$$",
  email: "masakaliottawa@gmail.com",
  servesCuisine: ["Indian", "North Indian", "South Indian"],
  areaServed: "Ottawa, Ontario",
  ogImage: '/logo192.png',
  openingHours: ['Mo-Su 11:30-22:00'],
  services: ['Dine-in', 'Takeout', 'Delivery', 'Catering', 'Reservations'],
  restaurants: [
  {
    name: "Masakali Indian Cuisine – Stittsville",
    slug: "stittsville",
    streetAddress: "5507 Hazeldean Rd Unit C3-1",
    addressLocality: "Stittsville",
    addressRegion: "ON",
    postalCode: "K2S 0P5",
    addressCountry: "CA",
    telephone: "+1-613-878-3939",
    hasMap: "https://www.google.com/maps/dir/?api=1&destination=5507+Hazeldean+Rd+Unit+C3-1+Stittsville+ON+K2S+0P5",
    opens: "11:30",
    closes: "22:00",
  },
  {
    name: "Masakali Indian Cuisine – Wellington",
    slug: "wellington",
    streetAddress: "1111 Wellington St. W",
    addressLocality: "Ottawa",
    addressRegion: "ON",
    postalCode: "K1Y 1P1",
    addressCountry: "CA",
    telephone: "+1-613-792-9777",
    hasMap: "https://www.google.com/maps/dir/?api=1&destination=1111+Wellington+St+W+Ottawa+ON+K1Y+1P1",
    opens: "11:30",
    closes: "22:00",
  }
  ],
};

export const pages = {
  home: {
    path: "/",
    title: "Masakali Indian Cuisine | Ottawa Indian Restaurant",
    description: "Discover Masakali Indian Cuisine in Ottawa — Stittsville and Wellington. Explore the menu, reserve a table, or order catering.",
  },
  about: {
    path: "/about",
    title: "About Masakali | Ottawa Indian Restaurant Story",
    description: "Learn about Masakali Indian Cuisine in Ottawa, our Stittsville and Wellington branches, and our approach to authentic Indian dining.",
  },
  menu: {
    path: "/menu",
    title: "Menu | Masakali Indian Cuisine Ottawa",
    description: "Browse the Masakali Indian Cuisine menu for Stittsville and Wellington in Ottawa — curries, biryani, tandoor, vegetarian dishes, and more.",
  },
  locations: {
    path: "/locations",
    title: "Locations | Masakali Ottawa — Stittsville & Wellington",
    description: "Find Masakali Indian Cuisine in Ottawa: Stittsville (Hazeldean Rd) and Wellington Street West. Hours, directions, and contact details.",
  },
  reservations: {
    path: "/reservations",
    title: "Reservations | Book a Table at Masakali Ottawa",
    description: "Reserve a table at Masakali Indian Cuisine in Ottawa. Instant confirmation for Stittsville and Wellington locations.",
  },
  catering: {
    path: "/catering",
    title: "Catering | Masakali Indian Cuisine Ottawa",
    description: "Indian catering in Ottawa from Masakali — trays, parties, and events for Stittsville, Wellington, and surrounding areas.",
  },
  cateringByTray: {
    path: "/catering-by-tray",
    title: "Catering by the Tray | Masakali Ottawa",
    description: "Order Indian catering by the tray from Masakali Ottawa. Choose dishes, tray sizes, and schedule pickup or delivery options.",
  },
  contact: {
    path: "/contact",
    title: "Contact | Masakali Indian Cuisine Ottawa",
    description: "Contact Masakali Ottawa. Call Stittsville (613) 878-3939 or Wellington (613) 792-9777, or send a message online.",
  }
};

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('http') ? path : `${siteSeo.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  return normalized;
}

export function slugifyEntityId(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'location';
}

function organizationId() {
  return `${absoluteUrl('/')}#organization`;
}

function brandOrganizationId() {
  return `${absoluteUrl('/')}#brand`;
}

function groupOrganizationId() {
  return `${absoluteUrl('/')}#masakali-group`;
}

function restaurantEntityId(nameOrSlug) {
  return `${absoluteUrl('/')}#restaurant-${slugifyEntityId(nameOrSlug)}`;
}

function parseOpeningHoursSpec(location, fallbackOpens = '11:30', fallbackCloses = '22:00') {
  if (location?.opens && location?.closes) {
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: location.opens,
      closes: location.closes,
    };
  }

  const lines = Array.isArray(location?.opening_hours_lines)
    ? location.opening_hours_lines
    : Array.isArray(location?.opening_hours)
      ? location.opening_hours
      : String(location?.opening_hours || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

  const specs = [];
  const dayMap = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
    fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
  };

  lines.forEach((line) => {
    const text = String(line || '');
    // e.g. Mon-Sun: 11:30 AM - 10:00 PM
    const range = text.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
    if (!range) return;
    const to24 = (t, ampm) => {
      let [h, m] = t.split(':').map(Number);
      const ap = (ampm || '').toUpperCase();
      if (ap === 'PM' && h < 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    const opens = to24(range[1], range[2] || (text.match(/AM|PM/i) || [])[0]);
    const closes = to24(range[3], range[4] || (text.toUpperCase().includes('PM') ? 'PM' : ''));
    const lower = text.toLowerCase();
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (lower.includes('mon-thu') || lower.includes('mon–thu')) {
      days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    } else if (lower.includes('fri-sun') || lower.includes('fri–sun')) {
      days = ['Friday', 'Saturday', 'Sunday'];
    } else if (lower.includes('mon-sun') || lower.includes('mon–sun') || lower.includes('daily')) {
      days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens,
      closes,
    });
  });

  if (specs.length) return specs;

  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: fallbackOpens,
    closes: fallbackCloses,
  };
}

function buildMapsUrlFromParts(parts) {
  const query = parts.filter(Boolean).join(' ');
  if (!query) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function resolveHasMap(location = {}) {
  const configured = String(location.google_maps_url || location.hasMap || '').trim();
  if (configured) {
    // Prefer directions-style destination links for AI/assistant use.
    if (/google\.[^/]+\/maps/i.test(configured) || /maps\.google\./i.test(configured)) {
      return configured;
    }
    return configured;
  }
  const addressBits = [
    location.streetAddress || location.address,
    location.addressLocality || location.city,
    location.addressRegion || location.province_state,
    location.postalCode || location.postal_code,
    location.addressCountry || location.country,
  ];
  return buildMapsUrlFromParts(addressBits);
}

export function buildGroupOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': groupOrganizationId(),
    name: siteSeo.groupName,
    description: 'Masakali Group operates Masakali Indian Cuisine, Masakali Indian Restobar, and RangDe Indian Cuisine restaurants.',
    url: absoluteUrl('/'),
    brand: [
      { '@type': 'Brand', name: 'Masakali Indian Cuisine' },
      { '@type': 'Brand', name: 'Masakali Indian Restobar' },
      { '@type': 'Brand', name: 'RangDe Indian Cuisine' },
    ],
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(),
    name: siteSeo.siteName,
    legalName: siteSeo.brandName,
    url: absoluteUrl('/'),
    logo: absoluteUrl(siteSeo.ogImage),
    email: siteSeo.email,
    description: siteSeo.defaultDescription,
    parentOrganization: { '@id': groupOrganizationId() },
    brand: { '@type': 'Brand', '@id': brandOrganizationId(), name: siteSeo.brandName },
    contactPoint: siteSeo.restaurants.map((restaurant) => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: restaurant.telephone,
      areaServed: restaurant.addressLocality,
      availableLanguage: ['English'],
    })),
  };
}

function buildRestaurantNode(restaurant, overrides = {}) {
  const name = restaurant.name;
  const slug = restaurant.slug || name;
  const hasMap = resolveHasMap(restaurant);
  const telephone = restaurant.telephone || restaurant.phone || undefined;
  const email = restaurant.email || siteSeo.email;
  const website = restaurant.website || restaurant.url || absoluteUrl('/');
  const menuUrl = overrides.menuUrl || absoluteUrl('/menu');
  const node = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'LocalBusiness'],
    '@id': restaurantEntityId(slug),
    name,
    image: restaurant.image_url || restaurant.image || absoluteUrl(siteSeo.ogImage),
    url: website.startsWith('http') ? website : absoluteUrl(website),
    telephone: telephone || undefined,
    email: email || undefined,
    servesCuisine: siteSeo.servesCuisine,
    priceRange: siteSeo.priceRange,
    menu: menuUrl,
    acceptsReservations: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.streetAddress || restaurant.address || undefined,
      addressLocality: restaurant.addressLocality || restaurant.city || undefined,
      addressRegion: restaurant.addressRegion || restaurant.province_state || undefined,
      postalCode: restaurant.postalCode || restaurant.postal_code || undefined,
      addressCountry: restaurant.addressCountry || restaurant.country || undefined,
    },
    openingHoursSpecification: parseOpeningHoursSpec(restaurant),
    hasMap: hasMap || undefined,
    parentOrganization: { '@id': organizationId() },
    brand: { '@type': 'Brand', name: restaurant.brand || siteSeo.brandName },
  };

  const lat = Number(restaurant.latitude);
  const lng = Number(restaurant.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0)) {
    node.geo = {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    };
  }

  return node;
}

export function buildRestaurantJsonLd() {
  return siteSeo.restaurants.map((restaurant) => buildRestaurantNode(restaurant));
}

export function buildRestaurantJsonLdFromLocation(location) {
  if (!location) return null;
  return buildRestaurantNode({
    name: location.name || location.brand,
    slug: location.slug || location.name,
    brand: location.brand,
    streetAddress: location.address,
    addressLocality: location.city,
    addressRegion: location.province_state,
    postalCode: location.postal_code,
    addressCountry: location.country,
    telephone: location.phone,
    email: location.email,
    website: location.website,
    google_maps_url: location.google_maps_url,
    opening_hours: location.opening_hours,
    opening_hours_lines: location.opening_hours_lines,
    latitude: location.latitude,
    longitude: location.longitude,
    image_url: location.image_url,
  }, {
    menuUrl: location.website && String(location.website).replace(/\/$/, '') !== siteSeo.siteUrl
      ? `${String(location.website).replace(/\/$/, '')}/menu`
      : absoluteUrl('/menu'),
  });
}

export function buildLocationsPageJsonLd(locations = []) {
  const restaurants = (locations || [])
    .map((location) => buildRestaurantJsonLdFromLocation(location))
    .filter(Boolean);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/locations')}#location-list`,
    name: `${siteSeo.siteName} restaurant locations`,
    description: 'Active Masakali Group restaurant locations listed on this website, with addresses, phone numbers, hours, and Google Maps directions.',
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((restaurant, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: { '@id': restaurant['@id'] },
    })),
  };

  return [buildGroupOrganizationJsonLd(), buildOrganizationJsonLd(), ...restaurants, itemList];
}

export function buildRecommendedDishesJsonLd() {
  const dishes = flattenRecommendedDishes();
  const groups = dishRecommendationGroups.map((group) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/menu')}#${group.id}`,
    name: group.label,
    description: group.description,
    itemListElement: (group.dishes || []).map((dish, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MenuItem',
        name: dish.name,
        description: dish.explanation,
        url: absoluteUrl('/menu'),
        suitableForDiet: dish.diet === 'vegetarian'
          ? 'https://schema.org/VegetarianDiet'
          : undefined,
      },
    })),
  }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${absoluteUrl('/menu')}#recommended-dishes`,
      name: `${siteSeo.siteName} recommended dishes`,
      description: 'Signature, chef-recommended, vegetarian, and must-try dishes curated from the Masakali menu. Not a sales ranking.',
      numberOfItems: dishes.length,
      itemListElement: dishes.map((dish, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: dish.name,
        item: {
          '@type': 'MenuItem',
          name: dish.name,
          description: `${dish.explanation} (${dish.groupLabel})`,
          url: absoluteUrl('/menu'),
        },
      })),
    },
    ...groups,
  ];
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: siteSeo.siteName,
    url: absoluteUrl('/'),
    description: siteSeo.defaultDescription,
    publisher: { '@id': organizationId() },
    potentialAction: {
      '@type': 'ReserveAction',
      target: absoluteUrl('/reservations'),
      name: 'Reserve a table',
    },
  };
}

export function buildMenuItemJsonLd(item, path) {
  if (!item) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name,
    description: item.description || undefined,
    url: absoluteUrl(path),
    image: item.image_url || item.imageUrl || undefined,
    offers: item.price != null && item.price !== '' ? {
      '@type': 'Offer',
      priceCurrency: "CAD",
      price: String(item.price),
      availability: 'https://schema.org/InStock',
    } : undefined,
  };
  return data;
}

export const siteFaqs = [["Where is Masakali located in Ottawa?", "Masakali has two Ottawa branches: Stittsville at 5507 Hazeldean Rd Unit C3-1, and Wellington at 1111 Wellington St. W."], ["How can I reserve a table?", "You can reserve online on the Reservations page, or call Wellington at (613) 792-9777 or Stittsville at (613) 878-3939."], ["Do you offer catering?", "Yes. Masakali offers catering and catering-by-the-tray for events in the Ottawa area."], ["What cuisine does Masakali serve?", "Masakali serves authentic Indian cuisine, including classic curries, biryani, tandoor specialties, and vegetarian dishes."], ["What should I try at Masakali?", "Signature recommendations include Butter Chicken, Chicken Dum Biryani, Paneer Butter Masala, Tandoori Chicken, and Garlic Naan. See the full menu for current availability."]];

export function pageSeo(key, overrides = {}) {
  const page = pages[key] || {};
  return {
    title: overrides.title || page.title,
    description: overrides.description || page.description,
    path: overrides.path || page.path,
  };
}

export { dishRecommendationGroups, flattenRecommendedDishes };
