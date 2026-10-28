import type { Category, FacetTitleKey, SortBy } from '@/types';

export const en = {
  meta: {
    title: 'Phone catalog',
  },
  common: {
    back: 'Back',
    home: 'Home',
    close: 'Close',
    cancel: 'Cancel',
  },
  status: {
    loading: 'Loading',
    retry: 'Try again',
  },
  errors: {
    network: 'Network error. Check your connection and try again.',
    timeout: 'The server is taking too long to respond.',
    server: (status: number) => `Server error (${status}).`,
    invalid: 'Received an invalid response from the server.',
    config: 'This service is temporarily unavailable. Please try again later.',
    unknown: 'Something went wrong.',
    page: 'Something went wrong while showing this page.',
    productNotFound: 'Product was not found.',
  },
  nav: {
    phones: 'Phones',
    tablets: 'Tablets',
    accessories: 'Accessories',
  } satisfies Record<Category, string>,
  categories: {
    phones: 'Mobile phones',
    tablets: 'Tablets',
    accessories: 'Accessories',
  } satisfies Record<Category, string>,
  header: {
    mainNav: 'Main',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    breadcrumbs: 'Breadcrumbs',
    search: 'Search',
    searchProducts: 'Search products',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    favourites: 'Favourites',
    cart: 'Cart',
    darkTheme: 'Dark theme',
    ukrainianLanguage: 'Ukrainian language',
  },
  footer: {
    nav: 'Footer',
    contacts: 'Contacts',
    rights: 'Rights',
    backToTop: 'Back to top',
  },
  home: {
    title: 'Welcome to Nice Gadgets store!',
    newModels: 'Brand new models',
    hotPrices: 'Hot prices',
    shopByCategory: 'Shop by category',
    promotions: 'Promotions',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: (index: number) => `Go to slide ${index}`,
  },
  banners: {
    banner_phone: {
      alt: 'Three smartphones showing planets above a mountain landscape',
      eyebrow: 'Next level',
      title: 'See beyond the screen',
      subtitle: 'Immersive displays that bring every pixel to life.',
      cta: 'Shop phones',
    },
    banner_tablet: {
      alt: 'Three tablets on a rock ledge in front of a moonlit mountain range',
      eyebrow: 'Tablets',
      title: 'Big canvas, bigger ideas',
      subtitle: 'Create, watch and play on a display that has room for it all.',
      cta: 'Shop tablets',
    },
    banner_watch: {
      alt: 'Three smartwatches with green straps against a green mountain night sky',
      eyebrow: 'Accessories',
      title: 'Style that keeps time',
      subtitle: 'Smartwatches and straps to match your mood and your day.',
      cta: 'Shop accessories',
    },
  } as Record<
    string,
    {
      alt: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
    }
  >,
  catalog: {
    models: (count: number) => `${count} ${count === 1 ? 'model' : 'models'}`,
    sortBy: 'Sort by',
    itemsOnPage: 'Items on page',
    sort: {
      age: 'Newest',
      title: 'Alphabetically',
      price: 'Cheapest',
    } satisfies Record<SortBy, string>,
    all: 'All',
    empty: 'There are no models in this category yet.',
    pagination: 'Pagination',
    previousPage: 'Previous page',
    nextPage: 'Next page',
  },
  product: {
    availableColors: 'Available colors',
    selectCapacity: 'Select capacity',
    about: 'About',
    techSpecs: 'Tech specs',
    suggested: 'You may also like',
    previousProducts: 'Previous products',
    nextProducts: 'Next products',
  },
  specs: {
    screen: 'Screen',
    resolution: 'Resolution',
    processor: 'Processor',
    ram: 'RAM',
    capacity: 'Capacity',
    builtInMemory: 'Built in memory',
    camera: 'Camera',
    zoom: 'Zoom',
    cell: 'Cell',
  },
  card: {
    addToCart: 'Add to cart',
    added: 'Added',
    addToFavourites: 'Add to favourites',
    removeFromFavourites: 'Remove from favourites',
    favourite: 'favourite',
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty',
    total: (count: number) =>
      `Total for ${count} ${count === 1 ? 'item' : 'items'}`,
    checkout: 'Checkout',
    checkoutConfirm:
      'Checkout is not implemented yet. Do you want to clear the cart?',
    remove: 'Remove from cart',
    decrease: 'Decrease quantity',
    increase: 'Increase quantity',
  },
  checkout: {
    title: 'Checkout',
    orderPlaced: 'Order placed',
    thanks: (name: string) => `Thank you, ${name}! Your order has been placed.`,
    placeOrder: 'Place order',
    fields: {
      name: 'Full name',
      phone: 'Phone',
      email: 'Email',
      city: 'City',
      address: 'Delivery address',
    },
    delivery: {
      legend: 'Delivery method',
      branch: 'Nova Poshta branch',
      postomat: 'Nova Poshta postomat',
      courier: 'Nova Poshta courier',
    },
    validation: {
      required: 'This field is required',
      name: 'Name is too short',
      phone: 'Enter a valid phone number',
      email: 'Enter a valid email address',
      city: 'Select a city from the list',
      delivery: 'Please select a delivery point',
    },
    novaPoshta: {
      searching: 'Searching...',
      loading: 'Loading...',
      noCities: 'No cities found',
      noPoints: 'Nothing found in this city',
      selectCity: 'Select a city first',
      selectBranch: 'Select branch',
      selectPostomat: 'Select postomat',
    },
  },
  favourites: {
    title: 'Favourites',
    count: (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`,
    empty: 'Your favourites list is empty',
  },
  auth: {
    signIn: 'Sign in',
    signUp: 'Sign up',
    signOut: 'Sign out',
    account: 'Account',
    email: 'Email',
    password: 'Password',
    pending: 'Please wait',
    noAccount: 'No account yet?',
    haveAccount: 'Already have an account?',
    signedInAs: 'Signed in as',
    syncNote: 'Your cart and favourites are saved to your account.',
    confirmTitle: 'Check your email',
    confirmText: (email: string) =>
      `We sent a confirmation link to ${email}. Confirm your email, then sign in.`,
    validation: {
      required: 'This field is required',
      email: 'Enter a valid email address',
      passwordShort: (min: number) =>
        `Password must be at least ${min} characters`,
    },
    errors: {
      invalidCredentials: 'Wrong email or password.',
      userExists: 'An account with this email already exists.',
      weakPassword: 'This password is too weak. Try a longer one.',
      emailNotConfirmed: 'Confirm your email first, then sign in.',
      rateLimit: 'Too many attempts. Try again in a few minutes.',
      network: 'Network error. Check your connection and try again.',
      unknown: 'Something went wrong. Try again.',
    },
  },
  developer: {
    role: 'Full Stack Developer',
    about:
      'Junior full-stack developer focused on TS and React. Nice Gadgets is my portfolio project: a gadget store built end-to-end, from the interface to the serverless functions behind it.',
    github: 'View GitHub',
    linkedin: 'View LinkedIn',
    highlightsTitle: 'What is inside the project',
    highlights: [
      {
        title: 'Secrets stay on the server',
        text: 'The AI assistant and the Nova Poshta search go through Vercel serverless functions with validation, origin checks and rate limiting, so no API key reaches the browser.',
      },
      {
        title: 'Works with or without a backend',
        text: 'Supabase holds products and per-user data. Without it, the app falls back to bundled JSON files.',
      },
      {
        title: 'Atomic component structure',
        text: 'Atoms, molecules, organisms, templates and pages, with imports allowed only downwards.',
      },
      {
        title: 'Typed and checked',
        text: 'Strict TypeScript, ESLint, Prettier, Husky hooks and a GitHub Actions check on every pull request.',
      },
    ],
    stackTitle: 'Tech stack',
  },
  rights: {
    title: 'Rights',
    copyright:
      '© 2026 Nice Gadgets. All rights reserved. The source code, design and texts of this site are the property of the project authors.',
    trademarks:
      'Apple, iPhone, iPad and other product names and logos are trademarks of their respective owners. They are used on this site for illustration only and do not imply any affiliation or endorsement.',
    educational:
      'Nice Gadgets is an educational project. It is not a real store: no orders are fulfilled and no payments are processed.',
    origin:
      'Nice Gadgets began as a team project. This version is a personal portfolio continuation. Team repository:',
    originLink: 'GitHub',
    contact:
      'Questions or requests about the content of this site: reach out on',
  },
  notFound: {
    title: 'Page not found',
  },
  colors: {} as Record<string, string>,
  units: {} as Record<string, string>,
  search: {
    title: 'Search results',
    results: (count: number) =>
      `${count} ${count === 1 ? 'result' : 'results'}`,
    empty: (query: string) => `No results found for "${query}".`,
  },
  assistant: {
    open: 'Open AI assistant',
    hide: 'Hide AI assistant button',
    title: 'AI assistant',
    close: 'Close AI assistant',
    greeting:
      'Hi! I can help you with the store:\n• switch the site language;\n• find a product by model name;\n• compare two or three products.\nFor example: "compare iPhone 11 and iPhone 14 Pro".',
    messages: 'Chat messages',
    inputLabel: 'Message',
    placeholder: 'Ask the assistant',
    send: 'Send',
    thinking: 'Thinking...',
    clear: 'Clear chat',
    actions: {
      set_language: 'Interface language changed',
      search_products: 'Opened search results',
    } as Record<string, string>,
    errors: {
      config: 'The assistant is not configured yet.',
      network: 'Network error. Check your connection and try again.',
      timeout: 'The assistant took too long to answer. Try again.',
      rate_limit: 'Too many requests. Try again in a minute.',
      server: 'The assistant is temporarily unavailable.',
      invalid: 'Received an invalid response. Try again.',
    },
    compare: {
      table: 'Product comparison',
      notEnough:
        'I could not find two products to compare. Try the exact model names.',
      missing: (names: string) => `Not found: ${names}`,
      mismatched: (names: string) => `Different category, skipped: ${names}`,
    },
    chips: {
      label: 'Suggestions',
      switchLanguage: 'Switch to Ukrainian',
      find: 'Find a product',
      findPrefix: 'Find ',
      findExample: 'iPhone 14 Pro',
      compare: 'Compare products',
      comparePrefix: 'Compare ',
      compareExample: 'iPhone 11 and iPhone 14 Pro',
      show: 'Show suggestions',
      hide: 'Hide suggestions',
    },
  },
  filters: {
    title: 'Filters',
    reset: 'Reset all',
    open: 'Filters',
    price: 'Price range',
    min: 'Min',
    max: 'Max',
    groups: {
      brand: 'Brand',
      memory: 'Internal memory',
      caseSize: 'Case size',
      screen: 'Screen diagonal',
      ram: 'RAM',
      color: 'Color',
      year: 'Release year',
    } satisfies Record<FacetTitleKey, string>,
    upTo: (value: number) => `Up to ${value}"`,
    between: (from: number, to: number) => `${from}" - ${to}"`,
    over: (value: number) => `Over ${value}"`,
    noResults: 'No models match the selected filters.',
    apply: 'Show results',
    resetFilters: 'Reset filters',
  },
};

export type Translations = typeof en;
