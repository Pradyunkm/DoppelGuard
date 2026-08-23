"""
Ground Truth Benchmark Evaluation Dataset for DoppelGuard.

Contains 40 rigorously annotated social media profiles:
- 20 Synthetic / Malicious Impersonation / Bot / Scam / Phishing Profiles (Ground Truth: SUSPICIOUS / 1)
- 20 Legitimate / Verified / Normal Creator / Authentic Alt Accounts (Ground Truth: BENIGN / 0)

Spans multiple social platforms (Twitter, Instagram, LinkedIn, Telegram, YouTube),
geographic fraud context (Global crypto giveaways, Indian UPI scams, SEBI stock advisory phish),
and threat taxonomies (Impersonation, Recruitment fraud, Brand mimicry, Inauthentic botnet).
"""

from typing import List, Dict, Any

GROUND_TRUTH_DATASET: List[Dict[str, Any]] = [
    # =========================================================================
    # CLASS 1: POSITIVE (MALICIOUS / IMPERSONATOR / SCAM / BOT) - 20 CASES
    # =========================================================================
    {
        "id": "gt-pos-01",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "Elon Musk",
        "difficulty": "Easy",
        "profile": {
            "username": "elonmusk_official_eth",
            "name": "Elon Musk [Official Tesla Live]",
            "bio": "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
            "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
            "followers": 340,
            "following": 4890,
            "account_age_days": 3,
            "links": ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"]
        }
    },
    {
        "id": "gt-pos-02",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "Vitalik Buterin",
        "difficulty": "Easy",
        "profile": {
            "username": "vitalik_eth_support_desk",
            "name": "Vitalik Buterin (Community Desk)",
            "bio": "Ethereum core developer. Resolving Metamask and ERC20 wallet transfer issues. Send DM for assistance.",
            "photo_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "followers": 120,
            "following": 3200,
            "account_age_days": 12,
            "links": ["https://t.me/eth_support_desk_bot"]
        }
    },
    {
        "id": "gt-pos-03",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Recruitment",
        "threat_type": "recruitment_scam",
        "target_entity": "Google Careers",
        "difficulty": "Medium",
        "profile": {
            "username": "google_careers_recruitment",
            "name": "Google Talent Acquisition HR",
            "bio": "Official Global Recruiting Team at Google. Hiring remote Software Engineers, PMs, and Designers. Salary $120k-$240k.",
            "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            "followers": 950,
            "following": 1800,
            "account_age_days": 21,
            "links": ["https://google-careers-portal.top/apply", "https://wa.me/1987654321"]
        }
    },
    {
        "id": "gt-pos-04",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Brand",
        "threat_type": "brand_impersonation",
        "target_entity": "Apple Support",
        "difficulty": "Medium",
        "profile": {
            "username": "apple_care_direct_help",
            "name": "Apple Support Official Desk",
            "bio": "Authorized AppleCare Support representative. Experiencing AppleID lockout or iCloud issues? Click link for instant live recovery.",
            "photo_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150",
            "followers": 430,
            "following": 2100,
            "account_age_days": 8,
            "links": ["http://apple-id-verify.click/live-auth"]
        }
    },
    {
        "id": "gt-pos-05",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Scam",
        "threat_type": "impersonation",
        "target_entity": "Mukesh Ambani / Jio",
        "difficulty": "Easy",
        "profile": {
            "username": "jio_ambani_giveaway_india",
            "name": "Reliance Jio 5G Celebration Foundation",
            "bio": "Congratulations! Claim Rs 5 Lakh cash reward and free 1 year 5G recharge. Limited slots available, pay Rs 499 verification fee on UPI.",
            "photo_url": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150",
            "followers": 890,
            "following": 4900,
            "account_age_days": 4,
            "links": ["https://jio-5g-cashprize.xyz/claim", "https://wa.link/jio-support"]
        }
    },
    {
        "id": "gt-pos-06",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Scam",
        "threat_type": "impersonation",
        "target_entity": "Binance / CZ",
        "difficulty": "Medium",
        "profile": {
            "username": "binance_vip_airdrop_team",
            "name": "Binance Global Customer Support",
            "bio": "Official Binance Security Bot. Connect your Web3 wallet to verify unfreeze request and claim 100 USDT bonus.",
            "photo_url": "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=150",
            "followers": 1500,
            "following": 3900,
            "account_age_days": 18,
            "links": ["https://binance-walletconnect.top/auth"]
        }
    },
    {
        "id": "gt-pos-07",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Recruitment",
        "threat_type": "recruitment_scam",
        "target_entity": "Amazon HR",
        "difficulty": "Medium",
        "profile": {
            "username": "amazon_jobs_hiring_now",
            "name": "Amazon Global Talent Team",
            "bio": "Direct hiring without interview. Work from home data entry and package review jobs. Daily payout $300-$500. Registration fee required.",
            "photo_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150",
            "followers": 620,
            "following": 2900,
            "account_age_days": 14,
            "links": ["https://t.me/amazon_remote_careers_hr"]
        }
    },
    {
        "id": "gt-pos-08",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Bot",
        "threat_type": "fake_bot",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "user9847291847",
            "name": "Crypto Gain VIP",
            "bio": "Automated pump signals and guaranteed 200% ROI. Follow back for free signals.",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "followers": 15,
            "following": 5000,
            "account_age_days": 2,
            "links": ["https://t.me/pump_signals_fast"]
        }
    },
    {
        "id": "gt-pos-09",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "Satya Nadella",
        "difficulty": "Hard",
        "profile": {
            "username": "satya_nadella_official_",
            "name": "Satya Nadella (Microsoft Chairman)",
            "bio": "Chairman and CEO of Microsoft. Passionate about empowering every person and organization to achieve more. DM for venture grant inquiries.",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            "followers": 4100,
            "following": 3200,
            "account_age_days": 35,
            "links": ["https://microsoft-grant-application.online"]
        }
    },
    {
        "id": "gt-pos-10",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Brand",
        "threat_type": "brand_impersonation",
        "target_entity": "Netflix Support",
        "difficulty": "Easy",
        "profile": {
            "username": "netflix_billing_recovery",
            "name": "Netflix Member Support",
            "bio": "Account suspension notice: Update your payment information within 24 hours to prevent permanent account deletion.",
            "photo_url": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150",
            "followers": 80,
            "following": 2800,
            "account_age_days": 6,
            "links": ["http://netflix-billing-renew.click/login"]
        }
    },
    {
        "id": "gt-pos-11",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Scam",
        "threat_type": "impersonation",
        "target_entity": "Stock Advisory / SEBI Phish",
        "difficulty": "Medium",
        "profile": {
            "username": "sebi_certified_bull_traders",
            "name": "SEBI Registered Stock Advisory",
            "bio": "100% Guaranteed returns in BankNifty & Options. Join VIP Telegram for Jackpot calls. Daily profit Rs 25,000 to 1 Lakh.",
            "photo_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150",
            "followers": 1200,
            "following": 4200,
            "account_age_days": 19,
            "links": ["https://t.me/sebi_jackpot_options"]
        }
    },
    {
        "id": "gt-pos-12",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "Jensen Huang",
        "difficulty": "Medium",
        "profile": {
            "username": "jensen_huang_nvidia_ceo",
            "name": "Jensen Huang [NVIDIA AI Official]",
            "bio": "President and CEO of NVIDIA. Announcing NVIDIA AI Token community distribution. Claim $NVDA tokens.",
            "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            "followers": 2300,
            "following": 4100,
            "account_age_days": 15,
            "links": ["https://nvidia-ai-token-claim.xyz"]
        }
    },
    {
        "id": "gt-pos-13",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Brand",
        "threat_type": "brand_impersonation",
        "target_entity": "Meta Business Support",
        "difficulty": "Easy",
        "profile": {
            "username": "meta_business_copyright_help",
            "name": "Meta Copyright Infringement Notice",
            "bio": "Your Facebook/Instagram Page violates community terms. Submit appeal within 48 hours or page will be unpublished.",
            "photo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
            "followers": 310,
            "following": 3500,
            "account_age_days": 9,
            "links": ["https://meta-appeal-form-center.top/case-8921"]
        }
    },
    {
        "id": "gt-pos-14",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Bot",
        "threat_type": "fake_bot",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "follow_boost_9921",
            "name": "Get 10k Followers Fast",
            "bio": "Instant follower booster. Free trial 500 followers. DM your handle.",
            "photo_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "followers": 45,
            "following": 4900,
            "account_age_days": 1,
            "links": ["https://instant-boost-app.xyz"]
        }
    },
    {
        "id": "gt-pos-15",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "Sundar Pichai",
        "difficulty": "Hard",
        "profile": {
            "username": "sundar_pichai_executive",
            "name": "Sundar Pichai (Google & Alphabet)",
            "bio": "CEO of Google and Alphabet. Advancing AI for everyone. Official foundation grant giveaway program.",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "followers": 5200,
            "following": 2900,
            "account_age_days": 28,
            "links": ["https://pichai-philanthropy-grant.online"]
        }
    },
    {
        "id": "gt-pos-16",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Scam",
        "threat_type": "impersonation",
        "target_entity": "Telegram Support",
        "difficulty": "Medium",
        "profile": {
            "username": "telegram_premium_gift_bot",
            "name": "Telegram Premium Distribution",
            "bio": "Free 1-Year Telegram Premium subscription. Verify your phone number via SMS OTP in link to activate.",
            "photo_url": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150",
            "followers": 1800,
            "following": 3800,
            "account_age_days": 11,
            "links": ["http://telegram-gift-activation.top/auth"]
        }
    },
    {
        "id": "gt-pos-17",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Recruitment",
        "threat_type": "recruitment_scam",
        "target_entity": "Infosys HR",
        "difficulty": "Medium",
        "profile": {
            "username": "infosys_freshers_onboarding_hr",
            "name": "Infosys Careers Support Cell",
            "bio": "Direct placement for 2024 batch engineers. CTC 7.5 LPA. Pay Rs 1500 document processing fee to download offer letter.",
            "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            "followers": 740,
            "following": 3100,
            "account_age_days": 16,
            "links": ["https://wa.link/infosys_offer_desk"]
        }
    },
    {
        "id": "gt-pos-18",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Brand",
        "threat_type": "brand_impersonation",
        "target_entity": "PayPal Support",
        "difficulty": "Easy",
        "profile": {
            "username": "paypal_fraud_resolution_team",
            "name": "PayPal Dispute Assistant",
            "bio": "Unauthorized $499 transaction detected. Contact live resolution desk immediately to cancel charge.",
            "photo_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150",
            "followers": 220,
            "following": 2900,
            "account_age_days": 7,
            "links": ["http://paypal-security-dispute.click"]
        }
    },
    {
        "id": "gt-pos-19",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Impersonation",
        "threat_type": "impersonation",
        "target_entity": "MrBeast",
        "difficulty": "Easy",
        "profile": {
            "username": "mrbeast_cash_gift_live",
            "name": "MrBeast [Official Feastables Giveaway]",
            "bio": "Giving away $10,000 to the first 100 people who subscribe and download the sponsor app from the link below!",
            "photo_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "followers": 4800,
            "following": 4600,
            "account_age_days": 5,
            "links": ["https://t.me/mrbeast_prize_vault"]
        }
    },
    {
        "id": "gt-pos-20",
        "ground_truth_label": 1,
        "ground_truth_class": "MALICIOUS",
        "category": "Bot",
        "threat_type": "fake_bot",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "bot_matrix_crypto_node",
            "name": "Solana Node Operator",
            "bio": "Node validator rewards. Send SOL to receiving address to stake and earn 45% APY compounding weekly.",
            "photo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
            "followers": 30,
            "following": 4800,
            "account_age_days": 2,
            "links": ["https://sol-stake-vault.top"]
        }
    },

    # =========================================================================
    # CLASS 0: NEGATIVE (BENIGN / LEGITIMATE / VERIFIED / AUTHENTIC ALTS) - 20 CASES
    # =========================================================================
    {
        "id": "gt-neg-01",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "sarah_designs_portfolio",
            "name": "Sarah Jenkins | Product Designer",
            "bio": "Senior UI/UX Designer @ TechFlow. Sharing design systems, case studies, and minimalist wireframes.",
            "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "followers": 5420,
            "following": 480,
            "account_age_days": 780,
            "links": ["https://sarahjenkins.design", "https://dribbble.com/sjenk"]
        }
    },
    {
        "id": "gt-neg-02",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "alex_rivera_creates",
            "name": "Alex Rivera",
            "bio": "Cinematographer & Drone Pilot based in Seattle. Documenting the Pacific Northwest. Inquiries: alex@riverafilm.com",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "followers": 14200,
            "following": 610,
            "account_age_days": 1450,
            "links": ["https://riverafilm.com", "https://youtube.com/@alexrivera"]
        }
    },
    {
        "id": "gt-neg-03",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Dual Account",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Hard",
        "profile": {
            "username": "sarah_ui_sketches",
            "name": "Sarah Jenkins | UI Sandbox",
            "bio": "Experimental wireframes & daily design sandbox. Main account: @sarah_designs_portfolio. Senior Designer @ TechFlow.",
            "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "followers": 1280,
            "following": 340,
            "account_age_days": 410,
            "links": ["https://sarahjenkins.design/sandbox", "https://sarah_designs_portfolio"]
        }
    },
    {
        "id": "gt-neg-04",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Verified",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "elonmusk",
            "name": "Elon Musk",
            "bio": "Mars & Cars, Chips & Starlink",
            "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
            "followers": 180000000,
            "following": 750,
            "account_age_days": 5200,
            "links": ["https://x.com/elonmusk", "https://tesla.com"]
        }
    },
    {
        "id": "gt-neg-05",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Verified",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "vitalikbuterin",
            "name": "Vitalik Buterin",
            "bio": "Ethereum researcher and developer. Check out my blog at vitalik.eth.limo.",
            "photo_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "followers": 5200000,
            "following": 410,
            "account_age_days": 4300,
            "links": ["https://vitalik.eth.limo"]
        }
    },
    {
        "id": "gt-neg-06",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Verified",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "googlejobs",
            "name": "Google Careers",
            "bio": "Build for everyone. Explore open careers and life at Google. Official verified channel.",
            "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            "followers": 2400000,
            "following": 85,
            "account_age_days": 3400,
            "links": ["https://careers.google.com"]
        }
    },
    {
        "id": "gt-neg-07",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Verified",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "applesupport",
            "name": "Apple Support",
            "bio": "We’re here to provide tips, tricks and helpful information when you need it most.",
            "photo_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150",
            "followers": 1900000,
            "following": 12,
            "account_age_days": 4100,
            "links": ["https://support.apple.com"]
        }
    },
    {
        "id": "gt-neg-08",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Medium",
        "profile": {
            "username": "david_chen_code",
            "name": "David Chen",
            "bio": "Staff Software Engineer @ Stripe. Writing about distributed consensus, Raft, and Rust. Opinions mine.",
            "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
            "followers": 18400,
            "following": 890,
            "account_age_days": 2100,
            "links": ["https://github.com/davidchen", "https://davidchen.dev"]
        }
    },
    {
        "id": "gt-neg-09",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "priya_sharma_ai",
            "name": "Priya Sharma",
            "bio": "AI Researcher @ IISc Bangalore. LLM alignment and multilingual speech synthesis. Published at NeurIPS/ICLR.",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "followers": 6900,
            "following": 420,
            "account_age_days": 1150,
            "links": ["https://scholar.google.com/citations?user=priya_ai"]
        }
    },
    {
        "id": "gt-neg-10",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "marcus_vfx_studio",
            "name": "Marcus Vance | Visual FX",
            "bio": "Houdini FX Artist & Compositor. Credits: Dune 2, Cyberpunk. Sharing breakdown reels.",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
            "followers": 22100,
            "following": 670,
            "account_age_days": 1890,
            "links": ["https://artstation.com/marcusvfx", "https://vimeo.com/marcusvance"]
        }
    },
    {
        "id": "gt-neg-11",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Medium",
        "profile": {
            "username": "clara_sustainable_fashion",
            "name": "Clara Lindqvist",
            "bio": "Circular fashion designer in Stockholm. Upcycling vintage denim and zero-waste patterns.",
            "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
            "followers": 8900,
            "following": 510,
            "account_age_days": 820,
            "links": ["https://claraslowfashion.com"]
        }
    },
    {
        "id": "gt-neg-12",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "rahul_verma_fintech",
            "name": "Rahul Verma",
            "bio": "Product Lead @ Razorpay. Passionate about UPI infrastructure, developer APIs, and open banking.",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            "followers": 11300,
            "following": 780,
            "account_age_days": 1640,
            "links": ["https://linkedin.com/in/rahulvermafintech"]
        }
    },
    {
        "id": "gt-neg-13",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Medium",
        "profile": {
            "username": "elena_astro_photo",
            "name": "Elena Rostova",
            "bio": "Deep space astrophotographer. Chasing nebulae and planetary alignment under Bortle 1 skies.",
            "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            "followers": 31500,
            "following": 410,
            "account_age_days": 2400,
            "links": ["https://astrobin.com/users/elena_astro"]
        }
    },
    {
        "id": "gt-neg-14",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "sam_altman",
            "name": "Sam Altman",
            "bio": "OpenAI",
            "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            "followers": 3100000,
            "following": 520,
            "account_age_days": 5400,
            "links": ["https://blog.samaltman.com"]
        }
    },
    {
        "id": "gt-neg-15",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "torvalds",
            "name": "Linus Torvalds",
            "bio": "Creator of Linux & Git. Portland, OR.",
            "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
            "followers": 210000,
            "following": 0,
            "account_age_days": 5900,
            "links": ["https://github.com/torvalds"]
        }
    },
    {
        "id": "gt-neg-16",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Dual Account",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Hard",
        "profile": {
            "username": "alex_rivera_raw",
            "name": "Alex Rivera [Uncut Footage]",
            "bio": "B-roll, raw color grades & BTS clips. Secondary dump account for @alex_rivera_creates.",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "followers": 2800,
            "following": 210,
            "account_age_days": 650,
            "links": ["https://alex_rivera_creates"]
        }
    },
    {
        "id": "gt-neg-17",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Medium",
        "profile": {
            "username": "ananya_cooks_bengal",
            "name": "Ananya Mukherjee",
            "bio": "Culinary historian & food writer. Preserving traditional Bengali heirloom recipes. Columnist at Mint Lounge.",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "followers": 19400,
            "following": 620,
            "account_age_days": 1320,
            "links": ["https://bengalikitchenstories.in"]
        }
    },
    {
        "id": "gt-neg-18",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "lucas_cybersec_notes",
            "name": "Lucas Meyer",
            "bio": "Offensive security engineer & CTF player. Writeups on web assembly vulnerabilities and heap exploitation.",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            "followers": 15800,
            "following": 490,
            "account_age_days": 1780,
            "links": ["https://lucassec.io/blog", "https://github.com/lucasmeyer"]
        }
    },
    {
        "id": "gt-neg-19",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Medium",
        "profile": {
            "username": "dr_olivia_cardiology",
            "name": "Dr. Olivia Vance MD",
            "bio": "Cardiologist & Clinical Researcher. Preventive cardiovascular health & heart disease awareness. Not medical advice.",
            "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
            "followers": 42000,
            "following": 320,
            "account_age_days": 1920,
            "links": ["https://droliviavance.org"]
        }
    },
    {
        "id": "gt-neg-20",
        "ground_truth_label": 0,
        "ground_truth_class": "BENIGN",
        "category": "Legitimate",
        "threat_type": "none",
        "target_entity": None,
        "difficulty": "Easy",
        "profile": {
            "username": "maya_indie_gamedev",
            "name": "Maya Lin",
            "bio": "Solo developer making cozy pixel art puzzle games. Made with Godot. Wishlist 'Starfall Valley' on Steam!",
            "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            "followers": 27400,
            "following": 810,
            "account_age_days": 1210,
            "links": ["https://store.steampowered.com/app/19821/StarfallValley"]
        }
    }
]
