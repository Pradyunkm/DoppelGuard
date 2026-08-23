import { Post } from '../types/post';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    username: 'alex_roberts',
    userDisplayName: 'Alex Roberts',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
    caption: 'Early morning overcast angles in downtown Seattle. The brutalist concrete textures here catch low-angled sunlight in the most delicate way. Shot on Leica Q2 28mm.',
    likesCount: 1428,
    commentsCount: 38,
    timestamp: '2 hours ago',
    location: 'Seattle, Washington',
    tags: ['minimalism', 'architecture', 'leicaq2', 'urbangeometry'],
    comments: [
      {
        id: 'c1_1',
        postId: 'post_1',
        userId: 'user_2',
        username: 'elena_vance',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        content: 'That shadow gradient on the north facade is unreal Alex! 👌',
        timestamp: '1h ago',
        likesCount: 12
      },
      {
        id: 'c1_2',
        postId: 'post_1',
        userId: 'user_8',
        username: 'sora_takahashi',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
        content: 'Clean framing. The 28mm perspective works so well here.',
        timestamp: '45m ago',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'user_2',
    username: 'elena_vance',
    userDisplayName: 'Elena Vance ☕',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80',
    caption: 'Dialing in a natural processed Ethiopian anaerobic roast this morning. Notes of wild bergamot, candied peach, and jasmine blossoms. The ritual never gets old ☕✨',
    likesCount: 2310,
    commentsCount: 64,
    timestamp: '4 hours ago',
    location: 'Hayes Valley, San Francisco',
    tags: ['coffeetime', 'specialtycoffee', 'v60', 'morningroutine'],
    comments: [
      {
        id: 'c2_1',
        postId: 'post_2',
        userId: 'user_13',
        username: 'maya_patel',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        content: 'Would pair wonderfully with cardamom brioche! Need this bean recommendation 😋',
        timestamp: '3h ago',
        likesCount: 15
      },
      {
        id: 'c2_2',
        postId: 'post_2',
        userId: 'user_1',
        username: 'alex_roberts',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        content: 'Saved this spot for my next SF trip!',
        timestamp: '2h ago',
        likesCount: 4
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'user_8',
    username: 'sora_takahashi',
    userDisplayName: 'Sora Takahashi (高橋 空)',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80',
    caption: 'Rainy dusk in Shinjuku alleys. When the streetlights turn on and reflect against wet asphalt, the whole city turns into a chromatic canvas. 🌧️🏮',
    likesCount: 4890,
    commentsCount: 112,
    timestamp: '6 hours ago',
    location: 'Shinjuku, Tokyo',
    tags: ['tokyostreet', 'cyberpunkvibes', 'cinematic', 'nightphotography'],
    comments: [
      {
        id: 'c3_1',
        postId: 'post_3',
        userId: 'user_10',
        username: 'clara_nordic',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        content: 'The lighting contrast is pure magic Sora!',
        timestamp: '5h ago',
        likesCount: 19
      }
    ]
  },
  {
    id: 'post_4',
    userId: 'user_6',
    username: 'novatech_labs',
    userDisplayName: 'NovaTech Labs',
    userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    caption: 'Unveiling the NovaCore-X4 die package: 128 quantum-resistant hardware enclave cores running at under 15W TDP. Read our newly published whitepaper via bio link 🔬🚀',
    likesCount: 8940,
    commentsCount: 245,
    timestamp: '8 hours ago',
    location: 'NovaTech Silicon Center, San Jose',
    tags: ['semiconductors', 'quantumcomputing', 'hardware', 'engineering'],
    comments: [
      {
        id: 'c4_1',
        postId: 'post_4',
        userId: 'user_4',
        username: 'marcus_chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        content: 'Impressive power efficiency numbers. Curious about the memory interconnect latency numbers!',
        timestamp: '7h ago',
        likesCount: 42
      }
    ]
  },
  {
    id: 'post_5',
    userId: 'user_10',
    username: 'clara_nordic',
    userDisplayName: 'Clara Lindqvist',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    caption: 'Quiet afternoon stillness in our Copenhagen studio. Natural oak, unbleached linen, and soft diffused northern light. 🤍🪑',
    likesCount: 3120,
    commentsCount: 52,
    timestamp: '11 hours ago',
    location: 'Copenhagen, Denmark',
    tags: ['scandinaviandesign', 'minimalhome', 'interiorarchitecture', 'japandi'],
    comments: [
      {
        id: 'c5_1',
        postId: 'post_5',
        userId: 'user_16',
        username: 'hannah_ceramics',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        content: 'I spot the matte vase on the credenza! Looks stunning in that light.',
        timestamp: '9h ago',
        likesCount: 14
      }
    ]
  },
  {
    id: 'post_6',
    userId: 'user_14',
    username: 'liam_wander',
    userDisplayName: 'Liam O’Connor',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    caption: 'First light over the alpine ridge at 3,100 meters. Wind was gusting at -12°C, but standing above the cloud inversion made every single step worth it. 🏔️🎒',
    likesCount: 4190,
    commentsCount: 88,
    timestamp: '14 hours ago',
    location: 'Tyrol, Austrian Alps',
    tags: ['alpinism', 'mountaineering', 'wanderlust', 'cloudinversion'],
    comments: [
      {
        id: 'c6_1',
        postId: 'post_6',
        userId: 'user_1',
        username: 'alex_roberts',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        content: 'Breathtaking perspective Liam!',
        timestamp: '12h ago',
        likesCount: 7
      }
    ]
  },
  {
    id: 'post_7',
    userId: 'user_4',
    username: 'marcus_chen',
    userDisplayName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    caption: 'Refactored our telemetry ingestion pipeline to zero-copy memory buffers. 4.2x throughput increase with zero allocated heap spikes. Coffee and terminal sessions.',
    likesCount: 1540,
    commentsCount: 31,
    timestamp: '1 day ago',
    location: 'Austin, Texas',
    tags: ['rustlang', 'systemsprogramming', 'backend', 'devlife'],
    comments: [
      {
        id: 'c7_1',
        postId: 'post_7',
        userId: 'user_11',
        username: 'devon_miles',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
        content: 'Zero-copy is the way! Clean terminal setup too.',
        timestamp: '18h ago',
        likesCount: 9
      }
    ]
  },
  {
    id: 'post_8',
    userId: 'user_13',
    username: 'maya_patel',
    userDisplayName: 'Maya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    caption: 'Weekend batch: 80% hydration sourdough boules with roasted garlic and rosemary crumb. That ear blister is music to my ears! 🥖🌾 Recipe posted on journal.',
    likesCount: 3820,
    commentsCount: 94,
    timestamp: '1 day ago',
    location: 'London, United Kingdom',
    tags: ['sourdough', 'artisanbread', 'baking', 'fermentation'],
    comments: [
      {
        id: 'c8_1',
        postId: 'post_8',
        userId: 'user_2',
        username: 'elena_vance',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        content: 'The crumb structure looks immaculate Maya! 🤤',
        timestamp: '22h ago',
        likesCount: 16
      }
    ]
  },
  {
    id: 'post_9',
    userId: 'user_16',
    username: 'hannah_ceramics',
    userDisplayName: 'Hannah Bae',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&auto=format&fit=crop&q=80',
    caption: 'Fresh out of the gas kiln reduction firing. The celadon glaze pooled into these seafoam green crystalline micro-textures on dark iron clay. 🏺🌿',
    likesCount: 1980,
    commentsCount: 41,
    timestamp: '2 days ago',
    location: 'Kyoto, Japan',
    tags: ['ceramics', 'pottery', 'handthrown', 'wabisabi'],
    comments: [
      {
        id: 'c9_1',
        postId: 'post_9',
        userId: 'user_10',
        username: 'clara_nordic',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        content: 'These shapes are so peaceful Hannah.',
        timestamp: '1d ago',
        likesCount: 11
      }
    ]
  },
  {
    id: 'post_10',
    userId: 'user_15',
    username: 'lumina_gear',
    userDisplayName: 'Lumina Optical Tools',
    userAvatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop&q=80',
    caption: 'Anodized aerospace aluminum barrel, 14-blade rounded iris, and zero focus breathing. The Lumina 35mm T1.5 Cine Prime is shipping next week.',
    likesCount: 5210,
    commentsCount: 140,
    timestamp: '2 days ago',
    location: 'Munich, Germany',
    tags: ['cinematography', 'cinelens', 'filmmaking', 'optics'],
    comments: [
      {
        id: 'c10_1',
        postId: 'post_10',
        userId: 'user_1',
        username: 'alex_roberts',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        content: 'Eager to test this on the next documentary project.',
        timestamp: '1d ago',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post_11',
    userId: 'user_12',
    username: 'studio_aura',
    userDisplayName: 'Studio Aura Creative',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    caption: 'Spatial brand identity system crafted for an immersive architecture biennial. Minimal grid layouts colliding with fluid 3D kinetic typography.',
    likesCount: 6720,
    commentsCount: 83,
    timestamp: '3 days ago',
    location: 'Paris, France',
    tags: ['graphicdesign', 'brandidentity', 'typography', 'artdirection'],
    comments: [
      {
        id: 'c11_1',
        postId: 'post_11',
        userId: 'user_2',
        username: 'elena_vance',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        content: 'The typographic restraint here is legendary. Bravo team!',
        timestamp: '2d ago',
        likesCount: 21
      }
    ]
  },
  {
    id: 'post_12',
    userId: 'user_3',
    username: 'elena_vance_archive',
    userDisplayName: 'Elena Vance [Archive]',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    caption: 'Outtake #42 from Big Sur coastal drive. Portra 400 pushed 1 stop. Heavy ocean mist rolling across the Pacific cliffs. Main work on @elena_vance 🌊',
    likesCount: 840,
    commentsCount: 15,
    timestamp: '3 days ago',
    location: 'Big Sur, California',
    tags: ['35mm', 'filmphotography', 'portra400', 'filmisnotdead'],
    comments: [
      {
        id: 'c12_1',
        postId: 'post_12',
        userId: 'user_2',
        username: 'elena_vance',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        content: 'Loved this roll so much ✨',
        timestamp: '3d ago',
        likesCount: 33
      }
    ]
  },
  {
    id: 'post_13',
    userId: 'user_11',
    username: 'devon_miles',
    userDisplayName: 'Devon Miles',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
    caption: 'Composing the ambient dungeon soundtrack on the Prophet-6 synthesizer. Analog warmth and tape delay flutter hit different at 1 AM. 🎹🎮',
    likesCount: 1620,
    commentsCount: 44,
    timestamp: '4 days ago',
    location: 'Portland, Oregon',
    tags: ['gamedev', 'synthwave', 'prophet6', 'musicproduction'],
    comments: [
      {
        id: 'c13_1',
        postId: 'post_13',
        userId: 'user_4',
        username: 'marcus_chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        content: 'Can’t wait for the steam release Devon!',
        timestamp: '3d ago',
        likesCount: 5
      }
    ]
  },
  {
    id: 'post_14',
    userId: 'user_9',
    username: 'apex_talent_recruiting',
    userDisplayName: 'Apex Global Tech Careers',
    userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    caption: '🚀 URGENT HIRING NOTICE: Global tech syndicate is selecting 25 senior full-stack developers for remote contracts. Immediate start, weekly wire transfers in USD or crypto. Click bio link to verify eligibility immediately!',
    likesCount: 45,
    commentsCount: 7,
    timestamp: '4 days ago',
    location: 'Worldwide Remote',
    tags: ['remotejobs', 'hiringtech', 'workfromhome', 'engineeringjobs'],
    comments: [
      {
        id: 'c14_1',
        postId: 'post_14',
        userId: 'user_5',
        username: 'marcus_chen_official',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        content: 'Great initiative. Shared to my consulting network.',
        timestamp: '3d ago',
        likesCount: 1
      }
    ]
  },
  {
    id: 'post_15',
    userId: 'user_17',
    username: 'zack_urbanism',
    userDisplayName: 'Zack Reynolds',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1000&auto=format&fit=crop&q=80',
    caption: 'Protected two-way cycle tracks alongside light rail transit: the highest capacity-per-meter urban transit corridor combination in modern city planning. 🚲🚊',
    likesCount: 2890,
    commentsCount: 75,
    timestamp: '5 days ago',
    location: 'Toronto, Ontario',
    tags: ['urbanism', 'cycling', 'publictransit', 'walkablecities'],
    comments: [
      {
        id: 'c15_1',
        postId: 'post_15',
        userId: 'user_10',
        username: 'clara_nordic',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        content: 'Copenhagen vibes! Hope more cities adopt this standard.',
        timestamp: '4d ago',
        likesCount: 18
      }
    ]
  },
  {
    id: 'post_16',
    userId: 'user_18',
    username: 'zenith_ventures',
    userDisplayName: 'Zenith Early Seed Partners',
    userAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
    caption: 'Welcoming our Summer 2026 Founder Cohort at our Manhattan office. 14 exceptional engineering teams building the future of autonomous systems and zero-knowledge primitives.',
    likesCount: 4320,
    commentsCount: 92,
    timestamp: '5 days ago',
    location: 'New York, New York',
    tags: ['venturecapital', 'startups', 'founders', 'innovation'],
    comments: [
      {
        id: 'c16_1',
        postId: 'post_16',
        userId: 'user_6',
        username: 'novatech_labs',
        userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        content: 'Excited to mentor the deeptech founders in this batch! 🚀',
        timestamp: '4d ago',
        likesCount: 29
      }
    ]
  }
];

// Generates additional posts per profile so each profile has 3-9 posts in their profile grid
export function getPostsForUser(userId: string, username?: string): Post[] {
  const directPosts = INITIAL_POSTS.filter(p => p.userId === userId || (username && p.username === username));
  if (directPosts.length >= 3) return directPosts;

  // Curated fallback media items to ensure every profile has a stunning gallery
  const aestheticMedia = [
    { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&auto=format&fit=crop&q=80', cap: 'Capturing moments in transit. High shutter speed and deep grain.' },
    { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&auto=format&fit=crop&q=80', cap: 'Reflections along the fjord at golden hour.' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80', cap: 'Minimalist architecture study: light entering geometry.' },
    { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&auto=format&fit=crop&q=80', cap: 'Botanical textures under diffused studio lamps.' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&auto=format&fit=crop&q=80', cap: 'Deep pine woods trail run. Oxygen and silence.' },
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80', cap: 'Late night desk setup. Dark mode workflows and espresso.' }
  ];

  const generated = aestheticMedia.slice(0, 4).map((item, idx) => ({
    id: `extra_${userId}_${idx}`,
    userId,
    username: username || 'user',
    userDisplayName: username || 'User',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: item.url,
    caption: item.cap,
    likesCount: 120 + idx * 85,
    commentsCount: 8 + idx * 4,
    timestamp: `${idx + 2} weeks ago`,
    location: 'Studio Simulation',
    tags: ['simulation', 'visuals', 'aesthetic'],
    comments: []
  }));

  return [...directPosts, ...generated];
}
