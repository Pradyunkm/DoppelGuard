"""
Benchmarking & Statistical Accuracy Evaluation Harness for DoppelGuard.

Runs the ground truth evaluation dataset through the hybrid scoring engine and computes
confusion matrix metrics (Precision, Recall, F1, Specificity, Accuracy, ROC-AUC)
to provide verifiable empirical performance benchmarks for hackathon judges.
"""

import time
from typing import Dict, Any, List
from evaluation.dataset import GROUND_TRUTH_DATASET
from scoring.engine import analyze_profile_engine

def calculate_roc_auc(scores: List[float], labels: List[int]) -> float:
    """Calculates ROC-AUC using Wilcoxon-Mann-Whitney rank-sum statistic."""
    pos_scores = [s for s, l in zip(scores, labels) if l == 1]
    neg_scores = [s for s, l in zip(scores, labels) if l == 0]
    if not pos_scores or not neg_scores:
        return 1.0

    pairs_correct = 0.0
    total_pairs = len(pos_scores) * len(neg_scores)
    for pos in pos_scores:
        for neg in neg_scores:
            if pos > neg:
                pairs_correct += 1.0
            elif pos == neg:
                pairs_correct += 0.5
    return round(pairs_correct / total_pairs, 4)

def run_benchmark_suite(threshold: float = 45.0) -> Dict[str, Any]:
    """
    Executes the entire 40-case ground truth test suite against the DoppelGuard engine.
    """
    tp = 0
    fp = 0
    tn = 0
    fn = 0

    all_scores: List[float] = []
    all_labels: List[int] = []
    case_results: List[Dict[str, Any]] = []

    category_stats: Dict[str, Dict[str, int]] = {}

    start_time = time.perf_counter()

    for item in GROUND_TRUTH_DATASET:
        t0 = time.perf_counter()
        analysis = analyze_profile_engine(item["profile"])
        t1 = time.perf_counter()
        
        latency_ms = round((t1 - t0) * 1000.0, 1)
        risk_score = float(analysis["risk_score"])
        predicted_label = 1 if risk_score >= threshold else 0
        actual_label = item["ground_truth_label"]

        all_scores.append(risk_score)
        all_labels.append(actual_label)

        # Category tracking
        cat = item["category"]
        if cat not in category_stats:
            category_stats[cat] = {"total": 0, "correct": 0}
        category_stats[cat]["total"] += 1

        is_correct = (predicted_label == actual_label)
        if is_correct:
            category_stats[cat]["correct"] += 1

        # Matrix assignment
        if actual_label == 1 and predicted_label == 1:
            tp += 1
            classification = "TP"
        elif actual_label == 0 and predicted_label == 1:
            fp += 1
            classification = "FP"
        elif actual_label == 0 and predicted_label == 0:
            tn += 1
            classification = "TN"
        else: # actual_label == 1 and predicted_label == 0
            fn += 1
            classification = "FN"

        case_results.append({
            "id": item["id"],
            "username": item["profile"]["username"],
            "name": item["profile"]["name"],
            "category": item["category"],
            "ground_truth_class": item["ground_truth_class"],
            "ground_truth_label": actual_label,
            "predicted_score": risk_score,
            "predicted_band": analysis["risk_band"],
            "predicted_threat": analysis["threat_type"],
            "likely_target": analysis.get("likely_target"),
            "ml_probability": analysis.get("ml_probability"),
            "classification": classification,
            "is_correct": is_correct,
            "latency_ms": latency_ms,
            "summary_explanation": analysis["signals"][0]["explanation"] if analysis.get("signals") else ""
        })

    total_latency_ms = (time.perf_counter() - start_time) * 1000.0
    total_samples = len(GROUND_TRUTH_DATASET)

    # Standard metrics
    accuracy = round(((tp + tn) / total_samples) * 100.0, 1)
    precision = round((tp / (tp + fp) * 100.0) if (tp + fp) > 0 else 0.0, 1)
    recall = round((tp / (tp + fn) * 100.0) if (tp + fn) > 0 else 0.0, 1)
    specificity = round((tn / (tn + fp) * 100.0) if (tn + fp) > 0 else 0.0, 1)
    
    if (precision + recall) > 0:
        f1_score = round(2.0 * (precision * recall) / (precision + recall), 1)
    else:
        f1_score = 0.0

    roc_auc = calculate_roc_auc(all_scores, all_labels)
    avg_latency = round(total_latency_ms / total_samples, 1)

    # Category accuracy percentages
    category_breakdown = []
    for cat, data in category_stats.items():
        acc = round((data["correct"] / data["total"]) * 100.0, 1) if data["total"] > 0 else 0.0
        category_breakdown.append({
            "category": cat,
            "total_cases": data["total"],
            "correct_predictions": data["correct"],
            "accuracy_pct": acc
        })

    return {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "total_test_cases": total_samples,
        "positive_cases": sum(1 for l in all_labels if l == 1),
        "negative_cases": sum(1 for l in all_labels if l == 0),
        "decision_threshold": threshold,
        "confusion_matrix": {
            "true_positives": tp,
            "false_positives": fp,
            "true_negatives": tn,
            "false_negatives": fn
        },
        "metrics": {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1_score,
            "specificity": specificity,
            "roc_auc": roc_auc,
            "false_positive_rate": round(100.0 - specificity, 1),
            "false_negative_rate": round(100.0 - recall, 1),
            "avg_inference_latency_ms": avg_latency,
            "total_benchmark_time_ms": round(total_latency_ms, 1)
        },
        "category_breakdown": category_breakdown,
        "cases": case_results
    }
