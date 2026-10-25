import { GameItem, PaymentMethodInfo } from '../types';

export const GAMES_CATALOG: GameItem[] = [
  {
    id: 'free-fire',
    name: 'Free Fire',
    subtitle: 'Diamonds',
    short: 'BATTLE ROYALE',
    mark: 'FF',
    palette: 'game-fire',
    index: '01',
    image: '/assets/free-fire-tile.png',
    playerPlaceholder: 'যেমন: 123456789',
    playerHint: 'Free Fire প্রোফাইল ওপেন করে UID কপি করুন। UID ভুল হলে রিচার্জ অন্য অ্যাকাউন্টে চলে যেতে পারে।',
    packages: [
      { id: 'ff-100', name: '100 Diamonds', priceTaka: 80 },
      { id: 'ff-210', name: '210 Diamonds', priceTaka: 160, popular: true },
      { id: 'ff-530', name: '530 Diamonds', priceTaka: 390 },
      { id: 'ff-1080', name: '1080 Diamonds', priceTaka: 780 },
      { id: 'ff-weekly', name: 'Weekly Membership', priceTaka: 190, bonus: 'সাপ্তাহিক স্পেশাল' },
      { id: 'ff-monthly', name: 'Monthly Membership', priceTaka: 950, bonus: 'মাসিক ডিসকাউন্ট' }
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    subtitle: 'UC Top-Up',
    short: 'BATTLE ROYALE',
    mark: 'PUBG',
    palette: 'game-pubg',
    index: '02',
    image: '/assets/pubg-mobile-tile.webp',
    playerPlaceholder: 'যেমন: 5123456789',
    playerHint: 'PUBG Mobile এর ক্যারেক্টার ID (Character ID) দিন। যেমন: 5123456789',
    packages: [
      { id: 'pubg-60', name: '60 UC', priceTaka: 120 },
      { id: 'pubg-325', name: '325 UC', priceTaka: 590, popular: true },
      { id: 'pubg-660', name: '660 UC', priceTaka: 1150 },
      { id: 'pubg-1800', name: '1800 UC', priceTaka: 2950 }
    ]
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    subtitle: 'Diamonds',
    short: 'MOBA',
    mark: 'ML',
    palette: 'game-ml',
    index: '03',
    image: '/assets/mobile-legends-tile.webp',
    playerPlaceholder: 'যেমন: 12345678 (1234)',
    playerHint: 'আপনার User ID ও ব্র্যাকেটে Zone ID দিন। যেমন: 12345678 (2345)',
    packages: [
      { id: 'ml-86', name: '86 Diamonds', priceTaka: 140 },
      { id: 'ml-172', name: '172 Diamonds', priceTaka: 275, popular: true },
      { id: 'ml-257', name: '257 Diamonds', priceTaka: 410 },
      { id: 'ml-706', name: '706 Diamonds', priceTaka: 1050 }
    ]
  },
  {
    id: 'fc-mobile',
    name: 'FC Mobile',
    subtitle: 'Game Packs',
    short: 'FOOTBALL',
    mark: 'FC',
    palette: 'game-fc',
    index: '04',
    image: '/assets/fc-mobile-tile.webp',
    playerPlaceholder: 'যেমন: UID বা ইন-গেম ইউজারনেম',
    playerHint: 'EA Sports FC Mobile UID বা লিঙ্কড প্লেয়ার ID দিন।',
    packages: [
      { id: 'fc-starter', name: 'Starter Pack', priceTaka: 120 },
      { id: 'fc-value', name: 'Value Pack', priceTaka: 250, popular: true },
      { id: 'fc-pro', name: 'Pro Pack', priceTaka: 500 },
      { id: 'fc-mega', name: 'Mega Pack', priceTaka: 950 }
    ]
  }
];

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'bKash',
    name: 'bKash (বিকাশ)',
    number: '01778-796778',
    rawNumber: '01778796778',
    type: 'Personal (Send Money)',
    bgColor: '#e2136e',
    textColor: '#ffffff',
    note: 'বিকাশ অ্যাপ অথবা *247# থেকে Send Money করুন'
  },
  {
    id: 'Nagad',
    name: 'Nagad (নগদ)',
    number: '01778-796778',
    rawNumber: '01778796778',
    type: 'Personal (Send Money)',
    bgColor: '#f7931e',
    textColor: '#ffffff',
    note: 'নগদ অ্যাপ অথবা *167# থেকে Send Money করুন'
  },
  {
    id: 'Rocket',
    name: 'Rocket (রকেট)',
    number: '01778-796778-5',
    rawNumber: '017787967785',
    type: 'Personal (Send Money)',
    bgColor: '#8c338c',
    textColor: '#ffffff',
    note: 'রকেট অ্যাপ অথবা *322# থেকে Send Money করুন'
  }
];
