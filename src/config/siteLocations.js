export const SITE_KEY = 'ottawa';

export const SITE_LOCATION_SLUGS = {
  california: ['california'],
  montreal: ['montreal'],
  rangde: ['rangde'],
  restobar: ['restobar'],
  ottawa: ['stittsville', 'wellington'],
};

export function filterSiteLocations(locations, siteKey = SITE_KEY) {
  const allowed = SITE_LOCATION_SLUGS[siteKey] || [];
  return (locations || []).filter((location) => (
    allowed.includes(String(location.slug || location.location_slug || '').toLowerCase())
  ));
}
