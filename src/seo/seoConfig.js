const envSiteUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SITE_URL)
  ? process.env.REACT_APP_SITE_URL.replace(/\/$/, '')
  : null;

export const siteSeo = {
  siteName: "Masakali Indian Cuisine",
  siteUrl: envSiteUrl || "https://masakaliottawa.ca",
  brandShort: "Masakali",
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
  restaurants: [
  {
    name: "Masakali Indian Cuisine – Stittsville",
    streetAddress: "5507 Hazeldean Rd Unit C3-1",
    addressLocality: "Stittsville",
    addressRegion: "ON",
    postalCode: "K2S 0P5",
    addressCountry: "CA",
    telephone: "+1-613-878-3939",
  },
  {
    name: "Masakali Indian Cuisine – Wellington",
    streetAddress: "1111 Wellington St. W",
    addressLocality: "Ottawa",
    addressRegion: "ON",
    postalCode: "K1Y 1P1",
    addressCountry: "CA",
    telephone: "+1-613-792-9777",
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

export function buildRestaurantJsonLd() {
  return siteSeo.restaurants.map((restaurant) => ({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${absoluteUrl('/')}#restaurant-${restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: restaurant.name,
    image: absoluteUrl(siteSeo.ogImage),
    url: absoluteUrl('/'),
    telephone: restaurant.telephone,
    email: siteSeo.email,
    servesCuisine: siteSeo.servesCuisine,
    priceRange: siteSeo.priceRange,
    menu: absoluteUrl('/menu'),
    acceptsReservations: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.streetAddress,
      addressLocality: restaurant.addressLocality,
      addressRegion: restaurant.addressRegion,
      postalCode: restaurant.postalCode,
      addressCountry: restaurant.addressCountry,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '11:30',
      closes: '22:00',
    },
    areaServed: siteSeo.areaServed,
  }));
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: siteSeo.siteName,
    url: absoluteUrl('/'),
    description: siteSeo.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: siteSeo.siteName,
      url: absoluteUrl('/'),
      logo: absoluteUrl(siteSeo.ogImage),
      email: siteSeo.email,
    },
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

export const siteFaqs = [["Where is Masakali located in Ottawa?", "Masakali has two Ottawa branches: Stittsville at 5507 Hazeldean Rd Unit C3-1, and Wellington at 1111 Wellington St. W."], ["How can I reserve a table?", "You can reserve online on the Reservations page, or call Wellington at (613) 792-9777 or Stittsville at (613) 878-3939."], ["Do you offer catering?", "Yes. Masakali offers catering and catering-by-the-tray for events in the Ottawa area."], ["What cuisine does Masakali serve?", "Masakali serves authentic Indian cuisine, including classic curries, biryani, tandoor specialties, and vegetarian dishes."]];

export function pageSeo(key, overrides = {}) {
  const page = pages[key] || {};
  return {
    title: overrides.title || page.title,
    description: overrides.description || page.description,
    path: overrides.path || page.path,
  };
}
