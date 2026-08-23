"""
Scoring Rules and Weight Configurations for DoppelGuard.

Configures feature weights, risk bands, high-profile target registries,
and scam indicator patterns.
"""

from typing import Dict, Any, List

# Core scoring signal weights (Sum is normalized in engine.py)
DEFAULT_SIGNAL_WEIGHTS: Dict[str, float] = {
    "handle_mimicry": 0.25,        # Levenshtein/homoglyph/impersonation handle patterns
    "text_similarity": 0.20,       # Bio keywords, scam triggers, urgent call-to-actions
    "behavioral_anomaly": 0.25,    # Age vs follower/following ratio & velocity
    "image_similarity": 0.15,      # Avatar likeness, placeholder or stolen headshot
    "link_suspicion": 0.15         # Shorteners, telegram re-routes, suspicious TLDs
}

# Risk Band Thresholds
RISK_BAND_THRESHOLDS = {
    "LOW": (0.0, 34.99),
    "MEDIUM": (35.0, 64.99),
    "HIGH": (65.0, 84.99),
    "CRITICAL": (85.0, 100.0)
}

# High-risk impersonation target keywords / patterns
KNOWN_TARGET_PATTERNS = {
    "elon_musk": ["elon", "musk", "tesla", "spacex", "x_official", "xceo"],
    "vitalik_buterin": ["vitalik", "buterin", "ethereum", "eth_foundation", "erc20"],
    "binance_cz": ["cz_binance", "changpeng", "binance_vip", "binance_help", "binance_support"],
    "sam_altman": ["sam_altman", "sama", "openai", "chatgpt_official"],
    "sundar_pichai": ["sundar", "pichai", "google_ceo", "alphabet", "google_careers"],
    "satya_nadella": ["satya", "nadella", "microsoft_ceo", "microsoft_official"],
    "jensen_huang": ["jensen", "huang", "nvidia_ai", "nvidia_ceo"],
    "apple_support": ["apple_care", "apple_support", "tim_cook_official", "apple_id"],
    "meta_security": ["meta_support", "instagram_verify", "facebook_security", "meta_badge", "meta_business", "copyright_notice"],
    "netflix_support": ["netflix_billing", "netflix_support", "netflix_recovery"],
    "paypal_support": ["paypal_fraud", "paypal_dispute", "paypal_security"],
    "mrbeast": ["mrbeast", "feastables", "mrbeast_cash"],
    "telegram_support": ["telegram_premium", "telegram_support", "telegram_gift"],
    "hr_recruiter": ["talent_acquisition", "hr_recruiter", "careers_lead", "remote_hiring_manager", "freshers_onboarding"],
    # Indian high-profile targets
    "mukesh_ambani": ["ambani", "reliance", "jio_official", "mukesh_ril", "jio_ambani"],
    "narayana_murthy": ["infosys_founder", "narayan_murthy", "infosys_ceo", "infosys_freshers", "infosys_careers"],
    "tata_group": ["ratan_tata", "tata_official", "tatasons_help"],
    "sebi_advisory": ["sebi_certified", "sebi_registered", "banknifty_tips", "jackpot_calls"]
}

# Suspicious words often found in scams & impersonation profiles
HIGH_RISK_BIO_KEYWORDS: List[str] = [
    "giveaway", "airdrop", "send eth", "send btc", "official support",
    "whatsapp me", "dm to claim", "crypto investment", "forex trader",
    "recovery specialist", "guaranteed profit", "verify badge",
    "hiring urgently", "telegram link in bio", "dm for collaboration",
    "customer support representative", "backup account", "private account",
    "unauthorized transaction", "account suspension notice", "processing fee",
    "claim bonus", "connect wallet", "connect your web3", "work from home data entry",
    "pump signals", "1-year telegram premium", "solana node validator",
    # Indian-context scam keywords
    "urgent job offer", "work from home guaranteed", "pay after joining",
    "upi payment", "paytm investment", "share market tips", "lakh", "crore",
    "guaranteed returns", "sebi registered", "jackpot calls"
]

# Suspicious TLDs or URL shorteners
SUSPICIOUS_LINK_INDICATORS: List[str] = [
    "bit.ly", "tinyurl.com", "t.me", "wa.me", "cutt.ly", "linktr.ee",
    ".xyz", ".top", ".buzz", ".ru", ".tk", ".cf", ".click", ".vip", ".cc", ".online",
    # Indian scam link shorteners
    "wa.link", "instabio.cc", "lynk.id", "bio.link"
]

def get_risk_band(score: float) -> str:
    """Returns the risk band category based on 0-100 score."""
    for band, (low, high) in RISK_BAND_THRESHOLDS.items():
        if low <= score <= high:
            return band
    return "CRITICAL" if score >= 85.0 else "LOW"
