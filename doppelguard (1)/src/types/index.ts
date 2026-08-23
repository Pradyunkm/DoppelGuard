export interface ProfileInput {
  username: string;
  name?: string;
  bio?: string;
  photo_url?: string;
  followers?: number;
  following?: number;
  account_age_days?: number;
  links?: string[];
}

export interface SignalItem {
  name: string;
  contribution: number;
  explanation: string;
}

export interface FeatureImpactItem {
  feature_key: string;
  label: string;
  value: number;
  importance_weight: number;
  impact_score: number;
  direction: "RISK_INCREASE" | "BENIGN";
}

export interface VisualDiagnostics {
  phash?: string | null;
  dhash?: string | null;
  ref_phash?: string | null;
  hamming_distance?: number | null;
  visual_similarity?: number | null;
  is_visual_clone: boolean;
  is_ai_generated_suspect: boolean;
}

export interface MLDiagnostics {
  ml_risk_probability: number;
  ml_confidence: number;
  model_name: string;
  top_features: FeatureImpactItem[];
}

export type RiskBand = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ThreatType =
  | "fake_bot"
  | "impersonation"
  | "recruitment_scam"
  | "brand_impersonation"
  | "suspicious"
  | "none";

export interface ProfileAnalysisResponse {
  id?: string;
  risk_score: number;
  risk_band: RiskBand;
  signals: SignalItem[];
  likely_target: string | null;
  threat_type: ThreatType;
  recommended_action: string;
  created_at?: string;
  profile: ProfileInput;
  ml_diagnostics?: MLDiagnostics;
  visual_diagnostics?: VisualDiagnostics;
  ml_probability?: number;
}

export interface SimilarityBreakdown {
  username: number;
  name: number;
  bio: number;
  photo: number;
}

export interface EvidenceItem {
  name: string;
  explanation: string;
}

export type RelationshipVerdict = "legitimate_dual_account" | "impersonation" | "ambiguous";

export interface CompareResponse {
  similarity: SimilarityBreakdown;
  relationship: RelationshipVerdict;
  evidence: EvidenceItem[];
  confidence: number;
  visual_diagnostics?: VisualDiagnostics;
  id?: string;
  created_at?: string;
}

export interface SampleProfileItem {
  id: string;
  label: string;
  category: "Scam" | "Impersonation" | "Recruitment" | "Brand" | "Legitimate" | "Dual Account";
  description: string;
  profile: ProfileInput;
  comparisonTarget?: ProfileInput;
}

export interface ScoringWeights {
  handle_mimicry: number;
  text_similarity: number;
  behavioral_anomaly: number;
  image_similarity: number;
  link_suspicion: number;
}

// -------------------------------------------------------------
// BENCHMARK & EVALUATION TYPES
// -------------------------------------------------------------

export interface ConfusionMatrixData {
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
}

export interface BenchmarkMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  specificity: number;
  roc_auc: number;
  false_positive_rate: number;
  false_negative_rate: number;
  avg_inference_latency_ms: number;
  total_benchmark_time_ms: number;
}

export interface CategoryAccuracyItem {
  category: string;
  total_cases: number;
  correct_predictions: number;
  accuracy_pct: number;
}

export interface TestCaseResult {
  id: string;
  username: string;
  name: string;
  category: string;
  ground_truth_class: "MALICIOUS" | "BENIGN";
  ground_truth_label: number;
  predicted_score: number;
  predicted_band: RiskBand;
  predicted_threat: ThreatType;
  likely_target: string | null;
  ml_probability?: number;
  classification: "TP" | "FP" | "TN" | "FN";
  is_correct: boolean;
  latency_ms: number;
  summary_explanation: string;
}

export interface BenchmarkReport {
  timestamp: string;
  total_test_cases: number;
  positive_cases: number;
  negative_cases: number;
  decision_threshold: number;
  confusion_matrix: ConfusionMatrixData;
  metrics: BenchmarkMetrics;
  category_breakdown: CategoryAccuracyItem[];
  cases: TestCaseResult[];
}

// -------------------------------------------------------------
// CROSS-PLATFORM TYPES
// -------------------------------------------------------------

export interface PlatformDetailItem {
  platform: string;
  handle: string;
  status: string;
  followers: number;
  age_days: number;
  avatar: string;
  verified: boolean;
  alert?: string | null;
}

export interface CrossPlatformResponse {
  username: string;
  canonical_name: string;
  consistency_score: number;
  verdict: string;
  summary: string;
  max_age_divergence_days: number;
  platforms_audited: number;
  active_platforms_count: number;
  high_risk_clones_count: number;
  platform_details: PlatformDetailItem[];
}

// -------------------------------------------------------------
// SCRAPING & COMPETITIVE TYPES
// -------------------------------------------------------------

export interface ScrapeAndCheckResponse {
  scraped_profile: ProfileInput;
  platform: string;
  canonical_url: string;
  analysis: ProfileAnalysisResponse;
}

export interface CompetitorComparisonItem {
  name: string;
  focus: string;
  signals: string;
  image_analysis: string;
  target_identification: string;
  cross_platform: string;
  explainability: string;
  demo_plugin: string;
}

export interface CompetitiveMatrixData {
  competitors: CompetitorComparisonItem[];
  pitch_highlights: string[];
}
