import { SampleProfileItem } from "../types";

export const SAMPLE_PROFILES: SampleProfileItem[] = [
  {
    id: "elon-eth-scam",
    label: "Elon Musk - Fake 5000 ETH Giveaway",
    category: "Scam",
    description: "Brand new account mimicking Elon Musk with giveaway triggers, mass following, and Telegram redirection link.",
    profile: {
      username: "elonmusk_official_eth",
      name: "Elon Musk [Official Tesla Live]",
      bio: "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
      photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      followers: 340,
      following: 4890,
      account_age_days: 3,
      links: ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"]
    },
    comparisonTarget: {
      username: "elonmusk",
      name: "Elon Musk",
      bio: "Mars & Cars, Chips & Starlink",
      photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      followers: 180000000,
      following: 750,
      account_age_days: 5200,
      links: ["https://x.com/elonmusk", "https://tesla.com"]
    }
  },
  {
    id: "vitalik-support-phish",
    label: "Vitalik Buterin - Support Phishing Bot",
    category: "Impersonation",
    description: "Spoofs Ethereum founder offering fake customer support and DM wallet assistance.",
    profile: {
      username: "vitalik_eth_support_desk",
      name: "Vitalik Buterin (Community Desk)",
      bio: "Ethereum core developer. Resolving Metamask and ERC20 wallet transfer issues. Send DM for assistance.",
      photo_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      followers: 120,
      following: 3200,
      account_age_days: 12,
      links: ["https://t.me/eth_support_desk_bot"]
    },
    comparisonTarget: {
      username: "vitalikbuterin",
      name: "Vitalik Buterin",
      bio: "Ethereum researcher and developer. Check out my blog at vitalik.eth.limo.",
      photo_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      followers: 5200000,
      following: 410,
      account_age_days: 4300,
      links: ["https://vitalik.eth.limo"]
    }
  },
  {
    id: "google-recruiter-fraud",
    label: "Google HR - Recruitment Wire Fraud",
    category: "Recruitment",
    description: "Masquerades as enterprise Google talent recruiter advertising unrealistic salaries with phishing link.",
    profile: {
      username: "google_careers_recruitment",
      name: "Google Talent Acquisition HR",
      bio: "Official Global Recruiting Team at Google. Hiring remote Software Engineers, PMs, and Designers. Salary $120k-$240k.",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      followers: 950,
      following: 1800,
      account_age_days: 21,
      links: ["https://google-careers-portal.top/apply", "https://wa.me/1987654321"]
    },
    comparisonTarget: {
      username: "googlejobs",
      name: "Google Careers",
      bio: "Build for everyone. Explore open careers and life at Google. Official verified channel.",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      followers: 2400000,
      following: 85,
      account_age_days: 3400,
      links: ["https://careers.google.com"]
    }
  },
  {
    id: "apple-support-impersonation",
    label: "Apple Care - Brand Support Mimic",
    category: "Brand",
    description: "Fake customer care account targeting Apple users with fake warranty ticket submission.",
    profile: {
      username: "apple_care_direct_help",
      name: "Apple Support Official Desk",
      bio: "Authorized AppleCare Support representative. Experiencing AppleID lockout or iCloud issues? Click link for instant live recovery.",
      photo_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150",
      followers: 430,
      following: 2100,
      account_age_days: 8,
      links: ["http://apple-id-verify.click/live-auth"]
    },
    comparisonTarget: {
      username: "applesupport",
      name: "Apple Support",
      bio: "We’re here to provide tips, tricks and helpful information when you need it most.",
      photo_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150",
      followers: 1900000,
      following: 12,
      account_age_days: 4100,
      links: ["https://support.apple.com"]
    }
  },
  {
    id: "legitimate-dual-portfolio",
    label: "Sarah Jenkins - Legitimate Alt Portfolio",
    category: "Dual Account",
    description: "A legitimate secondary design account that explicitly cross-references her main profile.",
    profile: {
      username: "sarah_ui_sketches",
      name: "Sarah Jenkins | UI Sandbox",
      bio: "Experimental wireframes & daily design sandbox. Main account: @sarah_designs_portfolio. Senior Designer @ TechFlow.",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      followers: 1280,
      following: 340,
      account_age_days: 410,
      links: ["https://sarahjenkins.design/sandbox", "https://sarah_designs_portfolio"]
    },
    comparisonTarget: {
      username: "sarah_designs_portfolio",
      name: "Sarah Jenkins | Product Designer",
      bio: "Senior UI/UX Designer @ TechFlow. Sharing design systems, case studies, and minimalist wireframes.",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      followers: 5420,
      following: 480,
      account_age_days: 780,
      links: ["https://sarahjenkins.design", "https://dribbble.com/sjenk"]
    }
  },
  {
    id: "legitimate-normal-creator",
    label: "Alex Rivera - Verified Creative Producer",
    category: "Legitimate",
    description: "Standard authentic user profile with balanced metrics, original links, and zero impersonation patterns.",
    profile: {
      username: "alex_rivera_creates",
      name: "Alex Rivera",
      bio: "Cinematographer & Drone Pilot based in Seattle. Documenting the Pacific Northwest. Inquiries: alex@riverafilm.com",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      followers: 14200,
      following: 610,
      account_age_days: 1450,
      links: ["https://riverafilm.com", "https://youtube.com/@alexrivera"]
    }
  }
];
