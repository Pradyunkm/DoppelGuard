import { UserProfile } from '../types/profile';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user_1',
    username: 'alex_roberts',
    displayName: 'Alex Roberts',
    bio: 'Product designer & landscape photographer based in Seattle 🌲 Capturing muted light and minimalist architectural spaces. Leica Q2.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    followers: 24800,
    following: 612,
    accountAgeDays: 1420,
    verified: true,
    categoryTag: 'Creator & Photography',
    location: 'Seattle, WA',
    joinedDate: 'October 2021',
    badgeType: 'verified',
    links: [
      { id: 'l1', title: 'Portfolio & Prints', url: 'https://alexroberts.design', icon: 'globe' },
      { id: 'l2', title: 'Design Substack', url: 'https://alexroberts.substack.com', icon: 'link' }
    ]
  },
  {
    id: 'user_2',
    username: 'elena_vance',
    displayName: 'Elena Vance ☕',
    bio: 'Visual designer & specialty coffee explorer. Co-founder @StudioVance. Documenting slow mornings and brutalist typography.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    followers: 18400,
    following: 489,
    accountAgeDays: 980,
    verified: true,
    categoryTag: 'Art & Design',
    location: 'San Francisco, CA',
    joinedDate: 'January 2023',
    badgeType: 'verified',
    links: [
      { id: 'l3', title: 'Studio Vance', url: 'https://studiovance.co', icon: 'globe' },
      { id: 'l4', title: 'Instagram Dual Archive', url: 'https://doppelgram.com/elena_vance_archive', icon: 'link' }
    ]
  },
  {
    id: 'user_3',
    username: 'elena_vance_archive',
    displayName: 'Elena Vance [Archive]',
    bio: 'Secondary archival account for 35mm film outtakes, typography experiments & raw coffee logs. Main: @elena_vance ✨',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    followers: 3200,
    following: 120,
    accountAgeDays: 450,
    verified: false,
    categoryTag: 'Personal Archive',
    location: 'San Francisco, CA',
    joinedDate: 'June 2024',
    links: [
      { id: 'l5', title: 'Main Account', url: 'https://doppelgram.com/elena_vance', icon: 'globe' }
    ]
  },
  {
    id: 'user_4',
    username: 'marcus_chen',
    displayName: 'Marcus Chen',
    bio: 'Staff Systems Engineer @ CloudScale. Open source hacker. Building distributed engines in Rust & Go. Cyclist 🚴‍♂️',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    followers: 9400,
    following: 340,
    accountAgeDays: 1650,
    verified: true,
    categoryTag: 'Software Engineering',
    location: 'Austin, TX',
    joinedDate: 'March 2021',
    badgeType: 'verified',
    links: [
      { id: 'l6', title: 'GitHub', url: 'https://github.com/marcuschen-sys', icon: 'github' },
      { id: 'l7', title: 'Engineering Blog', url: 'https://marcuschen.dev', icon: 'globe' }
    ]
  },
  {
    id: 'user_5',
    username: 'marcus_chen_official',
    displayName: 'Marcus Chen (Official)',
    bio: 'Official public representative account. For urgent direct investment and consulting inquiries contact via external portal.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    followers: 124,
    following: 12,
    accountAgeDays: 14,
    verified: false,
    categoryTag: 'Business Consultant',
    location: 'Austin, TX',
    joinedDate: 'August 2026',
    links: [
      { id: 'l8', title: 'Direct VIP Form', url: 'https://bit.ly/marcus-consult-fast', icon: 'link' }
    ]
  },
  {
    id: 'user_6',
    username: 'novatech_labs',
    displayName: 'NovaTech Labs',
    bio: 'Pioneering next-generation quantum-accelerated microchips and edge computing modules. Advancing Silicon Silicon valley research.',
    profileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    followers: 142000,
    following: 45,
    accountAgeDays: 2100,
    verified: true,
    badgeType: 'business',
    categoryTag: 'Technology & Robotics',
    location: 'San Jose, CA',
    joinedDate: 'September 2019',
    links: [
      { id: 'l9', title: 'Official Portal', url: 'https://novatechlabs.io', icon: 'globe' },
      { id: 'l10', title: 'Research Papers', url: 'https://arxiv.org/novatech', icon: 'link' }
    ]
  },
  {
    id: 'user_7',
    username: 'novatech_support_direct',
    displayName: 'NovaTech Customer Support',
    bio: '24/7 Global Hardware & Account Customer Resolution Desk for NovaTech products. Direct messaging open for instant ticket triage.',
    profileImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80',
    followers: 67,
    following: 2,
    accountAgeDays: 9,
    verified: false,
    categoryTag: 'Customer Support Desk',
    location: 'Global',
    joinedDate: 'August 2026',
    links: [
      { id: 'l11', title: 'Emergency Support Form', url: 'https://support-novatech-ticket-portal.net', icon: 'link' }
    ]
  },
  {
    id: 'user_8',
    username: 'sora_takahashi',
    displayName: 'Sora Takahashi (高橋 空)',
    bio: 'Tokyo based street photographer & architect. Obsessed with shadows, brutalist subway structures & neon rain reflections.',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    followers: 53100,
    following: 820,
    accountAgeDays: 1250,
    verified: true,
    categoryTag: 'Urban Photography',
    location: 'Tokyo, Japan',
    joinedDate: 'March 2022',
    badgeType: 'verified',
    links: [
      { id: 'l12', title: 'Tokyo Monograph 2026', url: 'https://soratakahashi.photo', icon: 'globe' }
    ]
  },
  {
    id: 'user_9',
    username: 'apex_talent_recruiting',
    displayName: 'Apex Global Tech Careers',
    bio: '⚡ Hiring immediately! Senior Remote Frontend & AI Engineers ($280k-$360k USD). No interviews required! Fill form below to claim bonus.',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
    followers: 310,
    following: 18,
    accountAgeDays: 18,
    verified: false,
    categoryTag: 'Recruitment & Jobs',
    location: 'Global / Remote',
    joinedDate: 'August 2026',
    links: [
      { id: 'l13', title: 'Instant Job Application Portal', url: 'https://remote-careers-apex-hiring.xyz/apply', icon: 'link' }
    ]
  },
  {
    id: 'user_10',
    username: 'clara_nordic',
    displayName: 'Clara Lindqvist',
    bio: 'Interior architect & sustainable furniture curator. Living between Copenhagen & Stockholm. Scandinavian light.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    followers: 39600,
    following: 512,
    accountAgeDays: 1560,
    verified: true,
    categoryTag: 'Interior & Architecture',
    location: 'Copenhagen, Denmark',
    joinedDate: 'May 2021',
    badgeType: 'verified',
    links: [
      { id: 'l14', title: 'Nordic Spaces Book', url: 'https://claralindqvist.com', icon: 'globe' }
    ]
  },
  {
    id: 'user_11',
    username: 'devon_miles',
    displayName: 'Devon Miles',
    bio: 'Indie game developer & pixel artist. Creating cozy retro RPGs. Coffee addict and synthesizer enthusiast.',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    followers: 12800,
    following: 430,
    accountAgeDays: 820,
    verified: false,
    categoryTag: 'Game Development',
    location: 'Portland, OR',
    joinedDate: 'May 2023',
    links: [
      { id: 'l15', title: 'Steam Page', url: 'https://store.steampowered.com/devonmiles', icon: 'link' }
    ]
  },
  {
    id: 'user_12',
    username: 'studio_aura',
    displayName: 'Studio Aura Creative',
    bio: 'Brand strategy, art direction & generative identity systems for ambitious digital products. Paris / London.',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=80',
    followers: 67300,
    following: 210,
    accountAgeDays: 1890,
    verified: true,
    badgeType: 'business',
    categoryTag: 'Design Agency',
    location: 'Paris, France',
    joinedDate: 'January 2020',
    links: [
      { id: 'l16', title: 'Agency Portfolio', url: 'https://studioaura.design', icon: 'globe' }
    ]
  },
  {
    id: 'user_13',
    username: 'maya_patel',
    displayName: 'Maya Patel',
    bio: 'Culinary explorer, food stylist & sourdough fermentation obsessive. Sharing kitchen formulas and seasonal recipes 🥖',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    followers: 41200,
    following: 730,
    accountAgeDays: 1110,
    verified: true,
    categoryTag: 'Food & Cooking',
    location: 'London, UK',
    joinedDate: 'August 2022',
    badgeType: 'verified',
    links: [
      { id: 'l17', title: 'My Recipe Journal', url: 'https://mayapatelrecipes.com', icon: 'globe' }
    ]
  },
  {
    id: 'user_14',
    username: 'liam_wander',
    displayName: 'Liam O’Connor',
    bio: 'Alpine mountaineer, trail runner & outdoor filmmaker. Chasing peaks across Patagonia, Alps, and Cascades 🏔️',
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    followers: 29500,
    following: 405,
    accountAgeDays: 1300,
    verified: false,
    categoryTag: 'Adventure & Travel',
    location: 'Innsbruck, Austria',
    joinedDate: 'March 2022',
    links: [
      { id: 'l18', title: 'Expedition Journal', url: 'https://liamoconnor.world', icon: 'globe' }
    ]
  },
  {
    id: 'user_15',
    username: 'lumina_gear',
    displayName: 'Lumina Optical Tools',
    bio: 'Handcrafted precision prime lenses and magnetic filters for mirrorless cinema rigs. Engineered in Munich.',
    profileImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    followers: 89000,
    following: 115,
    accountAgeDays: 1740,
    verified: true,
    badgeType: 'business',
    categoryTag: 'Camera Equipment',
    location: 'Munich, Germany',
    joinedDate: 'September 2020',
    links: [
      { id: 'l19', title: 'Lumina Official Store', url: 'https://luminagear.de', icon: 'globe' }
    ]
  },
  {
    id: 'user_16',
    username: 'hannah_ceramics',
    displayName: 'Hannah Bae',
    bio: 'Ceramicist throwing stoneware vases & tactile tablewares. Small batch drops every first Sunday of the month 🏺',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    followers: 16700,
    following: 610,
    accountAgeDays: 790,
    verified: false,
    categoryTag: 'Art & Pottery',
    location: 'Kyoto / Seoul',
    joinedDate: 'June 2023',
    links: [
      { id: 'l20', title: 'Shop Collection', url: 'https://hannahbaeceramics.com', icon: 'globe' }
    ]
  },
  {
    id: 'user_17',
    username: 'zack_urbanism',
    displayName: 'Zack Reynolds',
    bio: 'Urban planner exploring bike infrastructure, transit networks, and high-density walkable cities. Transit nerd 🚆',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    followers: 8400,
    following: 890,
    accountAgeDays: 610,
    verified: false,
    categoryTag: 'Urbanism & Transit',
    location: 'Toronto, Canada',
    joinedDate: 'December 2023',
    links: [
      { id: 'l21', title: 'Transit Maps & Data', url: 'https://zackurban.city', icon: 'globe' }
    ]
  },
  {
    id: 'user_18',
    username: 'zenith_ventures',
    displayName: 'Zenith Early Seed Partners',
    bio: 'Early-stage venture fund backing technical founders in AI tooling, developer platforms, and spatial computing.',
    profileImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    followers: 34100,
    following: 380,
    accountAgeDays: 1490,
    verified: true,
    badgeType: 'business',
    categoryTag: 'Venture Capital',
    location: 'New York, NY',
    joinedDate: 'August 2021',
    links: [
      { id: 'l22', title: 'Zenith Ventures', url: 'https://zenithventures.fund', icon: 'globe' }
    ]
  },
  {
    id: 'user_19',
    username: 'elonmusk_official2',
    displayName: 'Elon Musk 🔵 [Jio Official Partner]',
    bio: 'Mukesh Ambani & Elon Musk official. Jio Summer Giveaway — ₹5 lakh prize for 1000 lucky winners! Send your UPI ID to claim now. Limited time offer. DM to claim your reward.',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=80',
    followers: 120,
    following: 5000,
    accountAgeDays: 3,
    verified: false,
    categoryTag: 'Official Partner',
    location: 'Mumbai, India',
    joinedDate: 'August 2026',
    links: [
      { id: 'l23', title: 'Claim Prize Now', url: 'https://wa.link/jio-prize-claim-2026', icon: 'link' },
      { id: 'l24', title: 'Giveaway Details', url: 'https://instabio.cc/elon-jio-giveaway', icon: 'link' }
    ]
  },
  {
    id: 'user_20',
    username: 'google_hr_recruitment',
    displayName: 'Google India HR — Hiring 2026',
    bio: 'Official Google India Talent Acquisition Team. Urgently hiring remote Software Engineers & Data Analysts. Salary ₹12–24 LPA. No interviews required. Pay ₹500 registration fee via UPI to apply. Work from home guaranteed.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    followers: 88,
    following: 4200,
    accountAgeDays: 7,
    verified: false,
    categoryTag: 'Recruitment & HR',
    location: 'Bangalore, India',
    joinedDate: 'August 2026',
    links: [
      { id: 'l25', title: 'Apply Now — Google India', url: 'https://google-india-careers-2026.top/apply', icon: 'link' },
      { id: 'l26', title: 'WhatsApp HR Team', url: 'https://wa.link/google-hr-india', icon: 'link' }
    ]
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'current_user_0',
  username: 'demo_creator',
  displayName: 'Simulation Explorer',
  bio: 'Testing the DoppelGram photo simulation workspace. Exploring feed feeds, stories, and rich profile metrics.',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
  followers: 430,
  following: 86,
  accountAgeDays: 95,
  verified: true,
  categoryTag: 'Demo User',
  location: 'Virtual Sandbox',
  joinedDate: 'May 2026',
  badgeType: 'verified',
  links: [
    { id: 'self_1', title: 'DoppelGuard Security Hub', url: 'http://localhost:5173', icon: 'globe' }
  ]
};
