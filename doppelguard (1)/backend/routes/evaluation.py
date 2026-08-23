"""
Evaluation, Accuracy Benchmarking & Competitive Matrix Endpoints.
"""

from fastapi import APIRouter
from evaluation.benchmark import run_benchmark_suite
from evaluation.dataset import GROUND_TRUTH_DATASET

router = APIRouter(prefix="/evaluation", tags=["Evaluation & Benchmarks"])

COMPETITIVE_MATRIX_DATA = {
    "competitors": [
        {
            "name": "Botometer (Indiana Univ)",
            "focus": "Twitter bot activity & automation scoring",
            "signals": "Text & timing patterns only",
            "image_analysis": "❌ None (ignoring avatars)",
            "target_identification": "❌ None (generic bot probability)",
            "cross_platform": "❌ Twitter only",
            "explainability": "⚠️ Low (black-box score 0-5)",
            "demo_plugin": "❌ None"
        },
        {
            "name": "FaceCheck ID",
            "focus": "Facial recognition search engine",
            "signals": "Facial biometric vectors only",
            "image_analysis": "✅ Facial recognition",
            "target_identification": "⚠️ Face match only (no context)",
            "cross_platform": "⚠️ Web image index",
            "explainability": "❌ Match percentage only",
            "demo_plugin": "❌ None"
        },
        {
            "name": "SocialBlade",
            "focus": "Follower count analytics & rank",
            "signals": "Public count statistics",
            "image_analysis": "❌ None",
            "target_identification": "❌ None",
            "cross_platform": "⚠️ Separate platform tabs",
            "explainability": "❌ Raw numbers only",
            "demo_plugin": "❌ None"
        },
        {
            "name": "ZeroFox / BrandShield",
            "focus": "Enterprise executive protection ($25k+/yr)",
            "signals": "Domain scans & threat feeds",
            "image_analysis": "⚠️ Proprietary batch scan",
            "target_identification": "✅ Enterprise VIPs",
            "cross_platform": "✅ Enterprise connectors",
            "explainability": "⚠️ Analyst reports",
            "demo_plugin": "❌ Closed enterprise"
        },
        {
            "name": "DoppelGuard (Our System)",
            "focus": "Real-time Multimodal Impersonation Forensics & Live Feed Protection",
            "signals": "5-Signal Multimodal: Handle Mimicry + pHash Vision + Text Scams + Follower Asymmetry + Link TLDs",
            "image_analysis": "✅ 64-bit DCT pHash + dHash + Hamming Distance + AI Face Artifacts",
            "target_identification": "✅ Grounded Target Entity Attribution & Typo-Squatting Detection",
            "cross_platform": "✅ Cross-Platform Consistency Matrix (Twitter, IG, LinkedIn, Telegram)",
            "explainability": "✅ 100% Explainable AI: SHAP-style Feature Importance + Rule Contributions",
            "demo_plugin": "✅ End-to-End Social Feed Plugin (DoppelGram Live Extension)"
        }
    ],
    "pitch_highlights": [
        "Multimodal fusion beats single-vector tools (combining 64-bit pHash vision with NLP and behavioral velocity).",
        "Explainable AI (XAI) breakdown answers 'WHY is this profile high risk?' with exact feature attributions.",
        "End-to-end integration: Not just a research notebook, but a complete ecosystem with DoppelGram social feed."
    ]
}

@router.get("/benchmark")
def get_benchmark_report(threshold: float = 45.0):
    """
    Executes and returns the 40-case empirical benchmark report with Confusion Matrix,
    Precision, Recall, F1-Score, ROC-AUC, latency measurements, and category accuracies.
    """
    return run_benchmark_suite(threshold=threshold)

@router.get("/dataset")
def get_benchmark_dataset():
    """
    Returns the complete 40-case ground truth test dataset.
    """
    return {
        "total_count": len(GROUND_TRUTH_DATASET),
        "dataset": GROUND_TRUTH_DATASET
    }

@router.get("/competitive-matrix")
def get_competitive_matrix():
    """
    Returns the comprehensive competitive comparison matrix vs Botometer, FaceCheck, SocialBlade, ZeroFox.
    """
    return COMPETITIVE_MATRIX_DATA
