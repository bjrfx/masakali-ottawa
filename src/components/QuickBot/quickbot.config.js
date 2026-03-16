const quickBotConfig = {
  apiBase: '/api',
  themeColor: '#f59e0b',
  assistantName: 'Quick Bot',
  defaultMenuBranch: 'stittsville',
  defaultCallCountryCode: '+1',
  hideOnAdminRoutes: true,
  locations: [
    {
      id: 'cupertino',
      name: 'Cupertino, California',
      slug: 'california',
      menuBranch: null,
      aliases: ['cupertino', 'california', 'de anza'],
      fallbackPhone: '',
    },
    {
      id: 'stittsville',
      name: 'Stittsville, Ottawa',
      slug: 'stittsville',
      menuBranch: 'stittsville',
      aliases: ['stittsville', 'ottawa'],
      fallbackPhone: '+16138783939',
    },
    {
      id: 'wellington',
      name: 'Wellington, Ottawa',
      slug: 'wellington',
      menuBranch: 'wellington',
      aliases: ['wellington', 'ottawa'],
      fallbackPhone: '+16137929777',
    },
  ],
  menuCategories: [
    { key: 'veg-appetizers', label: 'Veg Appetizers' },
    { key: 'non-veg-appetizers', label: 'Non Veg Appetizers' },
    { key: 'chaat', label: 'Chaat' },
    { key: 'veg-curries', label: 'Veg Curries' },
    { key: 'chicken-curries', label: 'Chicken Curries' },
    { key: 'biryani', label: 'Biryani' },
    { key: 'desserts', label: 'Desserts' },
  ],
};

export default quickBotConfig;
